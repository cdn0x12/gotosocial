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

import { useActionAccountMutation, useHandleSignupMutation } from "../../../../lib/query/admin";
import MutationButton from "../../../../components/form/mutation-button";
import useFormSubmit from "../../../../lib/form/submit";
import {
	useValue,
	useTextInput,
	useBoolInput,
} from "../../../../lib/form";
import { Checkbox, Select, TextInput } from "../../../../components/form/inputs";
import { AdminAccount } from "../../../../lib/types/account";
import { useLocation } from "wouter";

export interface AccountActionsProps {
	account: AdminAccount,
	backLocation: string,
}

export function AccountActions({ account, backLocation }: AccountActionsProps) {
	const local = !account.domain;
	
	// Available actions differ depending
	// on the account's current status.
	switch (true) {
		case account.suspended:
			// Can't do anything with
			// suspended accounts currently.
			return null;
		case local && !account.approved:
			// Unapproved local account sign-up,
			// only show HandleSignup form.
			return (
				<HandleSignup
					account={account}
					backLocation={backLocation}
				/>
			);
		default:
			// Normal local or remote account, show
			// full range of moderation options.
			return <ModerateAccount account={account} />;
	}
}

function ModerateAccount({ account }: { account: AdminAccount }) {
	const form = {
		id: useValue("id", account.id),
		reason: useTextInput("text")
	};
	
	const reallySuspend = useBoolInput("reallySuspend");
	const [accountAction, result] = useFormSubmit(form, useActionAccountMutation());
	
	return (
		<form
			onSubmit={accountAction}
			aria-labelledby="account-moderation-actions"
		>
			<h3 id="account-moderation-actions">账户管理操作</h3>
			<div>
				目前仅实现了 "封禁" 操作。
				<br/>
				封禁账户将删除其在服务器上的数据，并移除所有媒体、帖文、关系等。
				<br/>
				如果被封禁的账户是本站账户，封禁操作还会向其他服务器发送 "删除" 消息，请求它们删除该账户的数据。
				<br/>
				<b>封禁操作无法撤销。</b>
			</div>
			<TextInput
				field={form.reason}
				placeholder="封禁理由"
				autoCapitalize="sentences"
			/>
			<div className="action-buttons">
				<MutationButton
					disabled={account.suspended || reallySuspend.value === undefined || reallySuspend.value === false}
					label="封禁"
					name="suspend"
					result={result}
				/>
				<Checkbox
					label="确认封禁"
					field={reallySuspend}
				></Checkbox>
			</div>
		</form>
	);
}

function HandleSignup({ account, backLocation }: { account: AdminAccount, backLocation: string }) {
	const form = {
		id: useValue("id", account.id),
		approveOrReject: useTextInput("approve_or_reject", { defaultValue: "approve" }),
		privateComment: useTextInput("private_comment"),
		message: useTextInput("message"),
		sendEmail: useBoolInput("send_email"),
	};

	const [_location, setLocation] = useLocation();

	const [handleSignup, result] = useFormSubmit(form, useHandleSignupMutation(), {
		changedOnly: false,
		// After submitting the form, redirect back to
		// /settings/admin/accounts if rejecting, since
		// account will no longer be available at
		// /settings/admin/accounts/:accountID endpoint.
		onFinish: (res) => {			
			if (form.approveOrReject.value === "approve") {
				// An approve request:
				// stay on this page and
				// serve updated details.
				return;
			}

			if (res.data) {
				// "reject" successful,
				// redirect to accounts page.
				setLocation(backLocation);
			}
		}
	});

	return (
		<form
			onSubmit={handleSignup}
			aria-labelledby="account-handle-signup"
		>
			<h3 id="account-handle-signup">处理账户注册</h3>
			<Select
				field={form.approveOrReject}
				label="批准或拒绝"
				options={
					<>
						<option value="approve">批准</option>
						<option value="reject">拒绝</option>
					</>
				}
			>
			</Select>
			{ form.approveOrReject.value === "reject" &&
			// Only show form fields relevant
			// to "reject" if rejecting.
			// On "approve" these fields will
			// be ignored anyway.
			<>
				<TextInput
					field={form.privateComment}
					label="(可选) 拒绝理由 (仅对其他管理员可见)"
				/>
				<Checkbox
					field={form.sendEmail}
					label="发送邮件给申请人"
				/>
				<TextInput
					field={form.message}
					label="(可选) 邮件内容"
				/>
			</> }
			<MutationButton
				disabled={false}
				label={form.approveOrReject.value === "approve" ? "批准" : "拒绝"}
				result={result}
			/>
		</form>
	);
}
