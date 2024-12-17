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

import React from "react";
import { useLocation, useParams } from "wouter";
import FormWithData from "../../../lib/form/form-with-data";
import BackButton from "../../../components/back-button";
import { useValue, useTextInput } from "../../../lib/form";
import useFormSubmit from "../../../lib/form/submit";
import { TextArea } from "../../../components/form/inputs";
import MutationButton from "../../../components/form/mutation-button";
import UsernameLozenge from "../../../components/username-lozenge";
import { useGetReportQuery, useResolveReportMutation } from "../../../lib/query/admin/reports";
import { useBaseUrl } from "../../../lib/navigation/util";
import { AdminReport } from "../../../lib/types/report";
import { yesOrNo } from "../../../lib/util";
import { Status } from "../../../components/status";

export default function ReportDetail({ }) {
	const params: { reportId: string } = useParams();
	const baseUrl = useBaseUrl();
	const backLocation: String = history.state?.backLocation ?? `~${baseUrl}`;

	return (
		<div className="report-detail">
			<h1><BackButton to={backLocation}/> 举报详情</h1>
			<FormWithData
				dataQuery={useGetReportQuery}
				queryArg={params.reportId}
				DataForm={ReportDetailForm}
				{...{ backLocation: backLocation }}
			/>
		</div>
	);
}

function ReportDetailForm({ data: report }: { data: AdminReport }) {
	const [ location ] = useLocation();
	const baseUrl = useBaseUrl();
	
	return (
		<>
			<ReportBasicInfo
				report={report}
				baseUrl={baseUrl}
				location={location}
			/>
			
			{ report.action_taken
				&& <ReportHistory 
					report={report}
					baseUrl={baseUrl}
					location={location}
				/>
			}

			{ report.statuses &&
				<ReportStatuses report={report} />
			}

			{ !report.action_taken &&
				<ReportActionForm report={report} />
			}
		</>
	);
}

interface ReportSectionProps {
	report: AdminReport;
	baseUrl: string;
	location: string;
}

function ReportBasicInfo({ report, baseUrl, location }: ReportSectionProps) {
	const from = report.account;
	const target = report.target_account;
	const comment = report.comment;
	const status = report.action_taken ? "已处理" : "未处理";
	const created = new Date(report.created_at).toLocaleString();

	return (
		<dl className="info-list overview">
			<div className="info-list-entry">
				<dt>举报账户</dt>
				<dd>
					<UsernameLozenge
						account={target}
						linkTo={`~/settings/moderation/accounts/${target.id}`}
						backLocation={`~${baseUrl}${location}`}
					/>
				</dd>
			</div>
		
			<div className="info-list-entry">
				<dt>举报人</dt>
				<dd>
					<UsernameLozenge
						account={from}
						linkTo={`~/settings/moderation/accounts/${from.id}`}
						backLocation={`~${baseUrl}${location}`}
					/>
				</dd>
			</div>

			<div className="info-list-entry">
				<dt>举报状态</dt>
				<dd>
					{ report.action_taken
						? <>{status}</>
						: <b>{status}</b>
					}
				</dd>
			</div>

			<div className="info-list-entry">
				<dt>举报原因</dt>
				<dd>
					{ comment.length > 0
						? <>{comment}</>
						: <i>未提供</i>
					}
				</dd>
			</div>

			<div className="info-list-entry">
				<dt>创建时间</dt>
				<dd>
					<time dateTime={report.created_at}>{created}</time>
				</dd>
			</div>

			<div className="info-list-entry">
				<dt>举报分类</dt>
				<dd>{ report.category }</dd>
			</div>

			<div className="info-list-entry">
				<dt>是否转发到对应站点</dt>
				<dd>{ yesOrNo(report.forwarded) }</dd>
			</div>
		</dl>
	);
}

function ReportHistory({ report, baseUrl, location }: ReportSectionProps) {
	const handled_by = report.action_taken_by_account;
	if (!handled_by) {
		throw "report handled by action_taken_by_account undefined";
	}
	
	const handled = report.action_taken_at ? new Date(report.action_taken_at).toLocaleString() : "never";
	
	return (
		<>
			<h3>审核记录</h3>
			<dl className="info-list">
				<div className="info-list-entry">
					<dt>处理人</dt>
					<dd>
						<UsernameLozenge
							account={handled_by}
							linkTo={`~/settings/moderation/accounts/${handled_by.id}`}
							backLocation={`~${baseUrl}${location}`}
						/>
					</dd>
				</div>

				<div className="info-list-entry">
					<dt>处理时间</dt>
					<dd>
						<time dateTime={report.action_taken_at}>{handled}</time>
					</dd>
				</div>

				<div className="info-list-entry">
					<dt>处理备注</dt>
					<dd>{ report.action_taken_comment ?? "none"}</dd>
				</div>
			</dl>
		</>
	);
}

function ReportActionForm({ report }) {
	const form = {
		id: useValue("id", report.id),
		comment: useTextInput("action_taken_comment")
	};

	const [submit, result] = useFormSubmit(form, useResolveReportMutation(), { changedOnly: false });

	return (
		<form onSubmit={submit}>
			<h3>处理举报</h3>
			<>
				在处理举报时，可以添加一个可选的备注。
				这有助于提供关于处理结果的解释（如果有）。
				<br />
				<div className="info">
					<i className="fa fa-fw fa-exclamation-triangle" aria-hidden="true"></i>
					<b>
						如果举报是由本站账户创建的，那么任何在这里添加的备注都将被发送给对应用户！
					</b>
				</div>
			</>
			<TextArea
				field={form.comment}
				label="备注"
				autoCapitalize="sentences"
			/>
			<MutationButton
				disabled={false}
				label="处理"
				result={result}
			/>
		</form>
	);
}

function ReportStatuses({ report }: { report: AdminReport }) {
	if (report.statuses.length === 0) {
		return null;
	}
	
	return (
		<div className="report-statuses">
			<h3>嘟文</h3>
			<ul className="thread">
				{ report.statuses.map((status) => {
					return (
						<Status
							key={status.id}
							status={status}
					 	/>
					);
				})}
			</ul>
		</div>
	);
}
