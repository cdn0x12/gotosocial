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

import React, { useMemo } from "react";
import { useGetHeaderAllowsQuery, useGetHeaderBlocksQuery } from "../../../lib/query/admin/http-header-permissions";
import { NoArg } from "../../../lib/types/query";
import { PageableList } from "../../../components/pageable-list";
import { HeaderPermission } from "../../../lib/types/http-header-permissions";
import { useLocation, useParams } from "wouter";
import { PermType } from "../../../lib/types/perm";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import HeaderPermCreateForm from "./create";
import { useCapitalize } from "../../../lib/util";

export default function HeaderPermsOverview() {
	const [ location, setLocation ] = useLocation();
	
	// Parse perm type from routing params.
	let params = useParams();
	if (params.permType !== "blocks" && params.permType !== "allows") {
		throw "unrecognized perm type " + params.permType;
	}
	const permType = useMemo(() => {
		return params.permType?.slice(0, -1) as PermType;
	}, [params]);

	// Uppercase first letter of given permType.
	const permTypeUpper = useCapitalize(permType);
	
	// Fetch desired perms, skipping
	// the ones we don't want.
	const {
		data: blocks,
		isLoading: isLoadingBlocks,
		isFetching: isFetchingBlocks,
		isSuccess: isSuccessBlocks,
		isError: isErrorBlocks,
		error: errorBlocks
	} = useGetHeaderBlocksQuery(NoArg, { skip: permType !== "block" });

	const {
		data: allows,
		isLoading: isLoadingAllows,
		isFetching: isFetchingAllows,
		isSuccess: isSuccessAllows,
		isError: isErrorAllows,
		error: errorAllows
	} = useGetHeaderAllowsQuery(NoArg, { skip: permType !== "allow" });

	const itemToEntry = (perm: HeaderPermission) => {
		return (
			<dl
				key={perm.id}
				className="entry pseudolink"
				onClick={() => {
					// When clicking on a header perm,
					// go to the detail view for perm.
					setLocation(`/${permType}s/${perm.id}`, {
						// Store the back location in
						// history so the detail view
						// can use it to return here.
						state: { backLocation: location }
					});
				}}
				role="link"
				tabIndex={0}
			>
				<dt>{perm.header}</dt>
				<dd>{perm.regex}</dd>
			</dl>
		);
	};

	const emptyMessage = (
		<div className="info">
			<i className="fa fa-fw fa-info-circle" aria-hidden="true"></i>
			<b>
				目前没有 HTTP 标头 {permType}s 规则。
				您可以使用下面的表单创建一个。
			</b>
		</div>
	);

	let isLoading: boolean;
	let isFetching: boolean;
	let isSuccess: boolean; 
	let isError: boolean;
	let error: FetchBaseQueryError | SerializedError | undefined;
	let items: HeaderPermission[] | undefined;

	if (permType === "block") {
		isLoading = isLoadingBlocks;
		isFetching = isFetchingBlocks;
		isSuccess = isSuccessBlocks;
		isError = isErrorBlocks;
		error = errorBlocks;
		items = blocks;
	} else {
		isLoading = isLoadingAllows;
		isFetching = isFetchingAllows;
		isSuccess = isSuccessAllows;
		isError = isErrorAllows;
		error = errorAllows;
		items = allows;
	}

	return (
		<div className="http-header-permissions">
			<div className="form-section-docs">
				<h1>HTTP 标头 {permTypeUpper} 规则</h1>
				<p>
					在这个页面，您可以查看、创建和移除 HTTP 标头 {permType} 规则，
					<br/>
					屏蔽和放行规则在 <code>advanced-header-filter-mode</code> 实例配置中设置的值不同。
					<br/>
					{ permType === "block" && <>
						<strong>
							当运行在 <code>block</code> 模式时，创建正则表达式时请非常小心，
							因为过于宽泛的匹配可能会导致实例拒绝所有请求，
							从而锁定您无法访问此设置页面。
						</strong>
						<br/>
						如果您不小心这样做，可以通过停止实例，将 <code>advanced-header-filter-mode</code> 设置为空字符串
						(禁用)，然后重新启动实例，并移除屏蔽规则来修复。
					</> }
				</p>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/admin/request_filtering_modes/"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于 HTTP 请求过滤的信息 (在新的标签页中打开)
				</a>
			</div>
			<PageableList
				isLoading={isLoading}
				isFetching={isFetching}
				isSuccess={isSuccess}
				isError={isError}
				error={error}
				items={items}
				itemToEntry={itemToEntry}
				emptyMessage={emptyMessage}
			/>
			<HeaderPermCreateForm permType={permType} />
		</div>
	);
}
