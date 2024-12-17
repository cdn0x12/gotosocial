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

import { useGetAccountQuery } from "../../../../lib/query/admin";
import FormWithData from "../../../../lib/form/form-with-data";
import FakeProfile from "../../../../components/profile";
import { AdminAccount } from "../../../../lib/types/account";
import { AccountActions } from "./actions";
import { useParams } from "wouter";
import { useBaseUrl } from "../../../../lib/navigation/util";
import BackButton from "../../../../components/back-button";
import { UseOurInstanceAccount, yesOrNo } from "../../../../lib/util";

export default function AccountDetail() {
	const params: { accountID: string } = useParams();
	const baseUrl = useBaseUrl();
	const backLocation: String = history.state?.backLocation ?? `~${baseUrl}`;

	return (
		<div className="account-detail">
			<h1><BackButton to={backLocation} /> 账户详情</h1>
			<FormWithData
				dataQuery={useGetAccountQuery}
				queryArg={params.accountID}
				DataForm={AccountDetailForm}
				{...{ backLocation: backLocation }}
			/>
		</div>
	);
}

interface AccountDetailFormProps {
	data: AdminAccount;
	backLocation: string;
}

function AccountDetailForm({ data: adminAcct, backLocation }: AccountDetailFormProps) {
	// If this is our instance account, don't
	// bother returning detailed account information.
	const ourInstanceAccount = UseOurInstanceAccount(adminAcct);
	if (ourInstanceAccount) {
		return (
			<>
				<FakeProfile {...adminAcct.account} />
				<div className="info">
					<i className="fa fa-fw fa-info-circle" aria-hidden="true"></i>
					<b>
						这是您的实例服务账户；您无法对此账户执行管理操作。
					</b>
				</div>
			</>
		);
	}

	const local = !adminAcct.domain;
	return (
		<>
			<FakeProfile {...adminAcct.account} />
			<GeneralAccountDetails adminAcct={adminAcct} />
			{
				// Only show local account details
				// if this is a local account!
				local && <LocalAccountDetails adminAcct={adminAcct} />
			}
			<AccountActions
				account={adminAcct}
				backLocation={backLocation}
			/>
		</>
	);
}

function GeneralAccountDetails({ adminAcct } : { adminAcct: AdminAccount }) {
	const local = !adminAcct.domain;
	const created = new Date(adminAcct.created_at).toDateString();
	
	let lastPosted = "never";
	if (adminAcct.account.last_status_at) {
		lastPosted = new Date(adminAcct.account.last_status_at).toDateString();
	}

	return (
		<>
			<h3>账户详情</h3>
			{ adminAcct.suspended && 
			<div className="info">
				<i className="fa fa-fw fa-info-circle" aria-hidden="true"></i>
				<b>账户已被封禁。</b>
			</div>
			}
			<dl className="info-list">
				{ !local &&
				<div className="info-list-entry">
					<dt>域名</dt>
					<dd>{adminAcct.domain}</dd>
				</div>}
				<div className="info-list-entry">
					<dt>账户页</dt>
					<dd>
						<a
							href={adminAcct.account.url}
							target="_blank"
							rel="noreferrer"
						>
							<i className="fa fa-fw fa-external-link" aria-hidden="true"></i> {adminAcct.account.url} (在新标签页中打开)
						</a> 
					</dd>
				</div>
				<div className="info-list-entry">
					<dt>创建时间</dt>
					<dd><time dateTime={adminAcct.created_at}>{created}</time></dd>
				</div>
				<div className="info-list-entry">
					<dt>最后发帖时间</dt>
					<dd>{lastPosted}</dd>
				</div>
				<div className="info-list-entry">
					<dt>封禁状态</dt>
					<dd>{yesOrNo(adminAcct.suspended)}</dd>
				</div>
				<div className="info-list-entry">
					<dt>隐藏状态</dt>
					<dd>{yesOrNo(adminAcct.silenced)}</dd>
				</div>
				<div className="info-list-entry">
					<dt>嘟文数</dt>
					<dd>{adminAcct.account.statuses_count}</dd>
				</div>
				<div className="info-list-entry">
					<dt>粉丝数</dt>
					<dd>{adminAcct.account.followers_count}</dd>
				</div>
				<div className="info-list-entry">
					<dt>关注数</dt>
					<dd>{adminAcct.account.following_count}</dd>
				</div>
			</dl>
		</>
	);
}

function LocalAccountDetails({ adminAcct }: { adminAcct: AdminAccount }) {	
	return (
		<>
			<h3>本站账户详情</h3>
			{ !adminAcct.approved &&
					<div className="info">
						<i className="fa fa-fw fa-info-circle" aria-hidden="true"></i>
						<b>账户待审核。</b>
					</div>
			}
			{ !adminAcct.confirmed && 
					<div className="info">
						<i className="fa fa-fw fa-info-circle" aria-hidden="true"></i>
						<b>账户邮箱未确认。</b>
					</div>
			}
			<dl className="info-list">
				<div className="info-list-entry">
					<dt>邮箱</dt>
					<dd>{adminAcct.email} {<b>{adminAcct.confirmed ? "(已确认)" : "(未确认)"}</b> }</dd>
				</div>
				<div className="info-list-entry">
					<dt>禁用状态</dt>
					<dd>{yesOrNo(adminAcct.disabled)}</dd>
				</div>
				<div className="info-list-entry">
					<dt>审核状态</dt>
					<dd>{yesOrNo(adminAcct.approved)}</dd>
				</div>
				<div className="info-list-entry">
					<dt>注册理由</dt>
					<dd>{adminAcct.invite_request ?? <i>未提供</i>}</dd>
				</div>
				{ (adminAcct.ip && adminAcct.ip !== "0.0.0.0") &&
					<div className="info-list-entry">
						<dt>注册IP</dt>
						<dd>{adminAcct.ip}</dd>
					</div> }
				{ adminAcct.locale &&
					<div className="info-list-entry">
						<dt>语言</dt>
						<dd>{adminAcct.locale}</dd>
					</div> }
			</dl>
		</> 
	);
}
