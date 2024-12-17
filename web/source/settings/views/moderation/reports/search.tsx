/*
	GoToSocial
	Copyright (C) GoToSocial Authors admin@gotosocial.org
	SPDX-License-Identifier: AGPL-3.0-or-later

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React, { ReactNode, useEffect, useMemo } from "react";

import { useLazySearchReportsQuery } from "../../../lib/query/admin/reports";
import { useTextInput } from "../../../lib/form";
import { PageableList } from "../../../components/pageable-list";
import { Select } from "../../../components/form/inputs";
import MutationButton from "../../../components/form/mutation-button";
import { useLocation, useSearch } from "wouter";
import UsernameLozenge from "../../../components/username-lozenge";
import { AdminReport } from "../../../lib/types/report";

export default function ReportsSearch() {
	return (
		<div className="reports-view">
			<h1>搜索举报</h1>
			<span>
				你可以使用下面的表单搜索本站账户的举报。
			</span>
			<ReportSearchForm />
		</div>
	);
}

function ReportSearchForm() {
	const [ location, setLocation ] = useLocation();
	const search = useSearch();
	const urlQueryParams = useMemo(() => new URLSearchParams(search), [search]);
	const hasParams = urlQueryParams.size != 0;
	const [ searchReports, searchRes ] = useLazySearchReportsQuery();

	// Populate search form using values from
	// urlQueryParams, to allow paging.
	const resolved = useMemo(() => {
		const resolvedRaw = urlQueryParams.get("resolved");
		if (resolvedRaw !== null) {
			return resolvedRaw;
		}
	}, [urlQueryParams]);

	const form = {
		resolved: useTextInput("resolved", { defaultValue: resolved }),
		account_id: useTextInput("account_id", { defaultValue: urlQueryParams.get("account_id") ?? "" }),
		target_account_id: useTextInput("target_account_id", { defaultValue: urlQueryParams.get("target_account_id") ?? "" }),
		limit: useTextInput("limit", { defaultValue: urlQueryParams.get("limit") ?? "20" })
	};

	const setResolved = form.resolved.setter;

	// On mount, if urlQueryParams were provided,
	// trigger the search. For example, if page
	// was accessed at /search?origin=local&limit=20,
	// then run a search with origin=local and
	// limit=20 and immediately render the results.
	//
	// If no urlQueryParams set, use the default
	// search (just show unresolved reports).
	useEffect(() => {
		if (hasParams) {
			searchReports(Object.fromEntries(urlQueryParams));
		} else {
			setResolved("false");
			setLocation(location + "?resolved=false");
		}
	}, [
		urlQueryParams,
		hasParams,
		searchReports,
		location,
		setLocation,
		setResolved,
	]);

	// Rather than triggering the search directly,
	// the "submit" button changes the location
	// based on form field params, and lets the
	// useEffect hook above actually do the search.
	function submitQuery(e) {
		e.preventDefault();
		
		// Parse query parameters.
		const entries = Object.entries(form).map(([k, v]) => {
			// Take only defined form fields.
			if (v.value === undefined || v.value.length === 0 || v.value === "any") {
				return null;
			}
			return [[k, v.value]];
		}).flatMap(kv => {
			// Remove any nulls.
			return kv || [];
		});

		const searchParams = new URLSearchParams(entries);
		setLocation(location + "?" + searchParams.toString());
	}

	// Location to return to when user clicks "back" on the detail view.
	const backLocation = location + (hasParams ? `?${urlQueryParams}` : "");
	
	// Function to map an item to a list entry.
	function itemToEntry(report: AdminReport): ReactNode {
		return (
			<ReportListEntry
				key={report.id}	
				report={report}
				linkTo={`/${report.id}`}
				backLocation={backLocation}
			/>
		);
	}

	return (
		<>
			<form
				onSubmit={submitQuery}
				// Prevent password managers
				// trying to fill in fields.
				autoComplete="off"
			>
				<Select
					field={form.resolved}
					label="举报状态"
					options={
						<>
							<option value="false">未处理</option>
							<option value="true">已处理</option>
							<option value="">全部</option>
						</>
					}
				></Select>
				<MutationButton
					disabled={false}
					label={"搜索"}
					result={searchRes}
				/>
			</form>
			<PageableList
				isLoading={searchRes.isLoading}
				isFetching={searchRes.isFetching}
				isSuccess={searchRes.isSuccess}
				items={searchRes.data?.accounts}
				itemToEntry={itemToEntry}
				isError={searchRes.isError}
				error={searchRes.error}
				emptyMessage={<b>没有找到符合条件的举报。</b>}
				prevNextLinks={searchRes.data?.links}
			/>
		</>
	);
}

interface ReportEntryProps {
	report: AdminReport;
	linkTo: string;
	backLocation: string;
}

function ReportListEntry({ report, linkTo, backLocation }: ReportEntryProps) {
	const [ _location, setLocation ] = useLocation();
	
	const from = report.account;
	const target = report.target_account;
	const comment = report.comment;
	const status = report.action_taken ? "已处理" : "未处理";
	const created = new Date(report.created_at).toLocaleString();
	const title = `${status}. @${target.account.acct} 被 @${from.account.acct} 举报于 ${created}. 原因: "${comment}"`;

	return (
		<span
			className={`pseudolink report entry${report.action_taken ? " resolved" : ""}`}
			aria-label={title}
			title={title}
			onClick={() => {
				// When clicking on a report, direct
				// to the detail view for that report.
				setLocation(linkTo, {
					// Store the back location in history so
					// the detail view can use it to return to
					// this page (including query parameters).
					state: { backLocation: backLocation }
				});
			}}
			role="link"
			tabIndex={0}
		>
			<dl className="info-list">
				<div className="info-list-entry">
					<dt>被举报账户:</dt>
					<dd className="text-cutoff">
						<UsernameLozenge
							account={target}
							classNames={["text-cutoff report-byline"]}
						/>
					</dd>
				</div>
				
				<div className="info-list-entry">
					<dt>举报人:</dt>
					<dd className="text-cutoff reported-by">
						<UsernameLozenge account={from} />
					</dd>
				</div>

				<div className="info-list-entry">
					<dt>举报状态:</dt>
					<dd className="text-cutoff">
						{ report.action_taken
							? <>{status}</>
							: <b>{status}</b>
						}
					</dd>
				</div>

				<div className="info-list-entry">
					<dt>举报原因:</dt>
					<dd className="text-cutoff">
						{ comment.length > 0
							? <>{comment}</>
							: <i>none provided</i>
						}
					</dd>
				</div>

				<div className="info-list-entry">
					<dt>创建时间:</dt>
					<dd className="text-cutoff">
						<time dateTime={report.created_at}>{created}</time>
					</dd>
				</div>
			</dl>
		</span>
	);
}
