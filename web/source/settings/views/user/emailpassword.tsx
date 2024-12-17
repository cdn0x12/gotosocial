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
import { useTextInput } from "../../lib/form";
import useFormSubmit from "../../lib/form/submit";
import { TextInput } from "../../components/form/inputs";
import MutationButton from "../../components/form/mutation-button";
import { useEmailChangeMutation, usePasswordChangeMutation, useUserQuery } from "../../lib/query/user";
import Loading from "../../components/loading";
import { User } from "../../lib/types/user";
import { useInstanceV1Query } from "../../lib/query/gts-api";

export default function EmailPassword() {
	return (
		<>
			<h1>邮箱和密码设置</h1>
			<EmailChange />
			<PasswordChange />
		</>
	);
}

function PasswordChange() {
	// Load instance data.
	const {
		data: instance,
		isFetching: isFetchingInstance,
		isLoading: isLoadingInstance
	} = useInstanceV1Query();
	if (isFetchingInstance || isLoadingInstance) {
		return <Loading />;
	}

	if (instance === undefined) {
		throw "could not fetch instance";
	}

	return <PasswordChangeForm oidcEnabled={instance.configuration.oidc_enabled} />;
}

function PasswordChangeForm({ oidcEnabled }: { oidcEnabled?: boolean }) {
	const form = {
		oldPassword: useTextInput("old_password"),
		newPassword: useTextInput("new_password", {
			validator(val) {
				if (val != "" && val == form.oldPassword.value) {
					return "新密码与旧密码相同";
				}
				return "";
			}
		})
	};

	const verifyNewPassword = useTextInput("verifyNewPassword", {
		validator(val) {
			if (val != "" && val != form.newPassword.value) {
				return "密码不匹配";
			}
			return "";
		}
	});

	const [submitForm, result] = useFormSubmit(form, usePasswordChangeMutation());

	return (
		<form className="change-password" onSubmit={submitForm}>
			<div className="form-section-docs">
				<h3>更改密码</h3>
				{ oidcEnabled && <p>
					本实例使用OIDC作为授权和身份提供者。
					<br/>
					这意味着<strong>你不能使用这个设置面板更改你的密码</strong>。
					<br/>
					要更改你的密码，你应该联系你的OIDC提供者。
				</p> }
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/user_guide/settings/#password-change"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于此设置的信息（在新标签页中打开）
				</a>
			</div>
			
			<TextInput
				type="password"
				name="password"
				field={form.oldPassword}
				label="当前密码"
				autoComplete="current-password"
				disabled={oidcEnabled}
			/>
			<TextInput
				type="password"
				name="newPassword"
				field={form.newPassword}
				label="新密码"
				autoComplete="new-password"
				disabled={oidcEnabled}
			/>
			<TextInput
				type="password"
				name="confirmNewPassword"
				field={verifyNewPassword}
				label="确认新密码"
				autoComplete="new-password"
				disabled={oidcEnabled}
			/>
			<MutationButton
				label="更改密码"
				result={result}
				disabled={oidcEnabled ?? false}
			/>
		</form>
	);
}

function EmailChange() {
	// Load instance data.
	const {
		data: instance,
		isFetching: isFetchingInstance,
		isLoading: isLoadingInstance
	} = useInstanceV1Query();
	
	// Load user data.
	const {
		data: user,
		isFetching: isFetchingUser,
		isLoading: isLoadingUser
	} = useUserQuery();

	if (
		(isFetchingInstance || isLoadingInstance) ||
		(isFetchingUser || isLoadingUser)
	) {
		return <Loading />;
	}

	if (user === undefined) {
		throw "could not fetch user";
	}

	if (instance === undefined) {
		throw "could not fetch instance";
	}

	return <EmailChangeForm user={user} oidcEnabled={instance.configuration.oidc_enabled} />;
}

function EmailChangeForm({user, oidcEnabled}: { user: User, oidcEnabled?: boolean }) {
	const form = {
		currentEmail: useTextInput("current_email", {
			defaultValue: user.email,
			nosubmit: true
		}),
		newEmail: useTextInput("new_email", {
			validator: (value: string | undefined) => {
				if (!value) {
					return "";
				}

				if (value.toLowerCase() === user.email?.toLowerCase()) {
					return "不能更改为现有的邮箱";
				}

				if (value.toLowerCase() === user.unconfirmed_email?.toLowerCase()) {
					return "你已经更改到了这个地址，但还没有确认";
				}

				return "";
			},
		}),
		password: useTextInput("password"),
	};
	const [submitForm, result] = useFormSubmit(form, useEmailChangeMutation());

	return (
		<form className="change-email" onSubmit={submitForm}>
			<div className="form-section-docs">
				<h3>更改邮箱</h3>
				{ oidcEnabled && <p>
					本实例使用OIDC作为授权和身份提供者。
					<br/>
					你可以使用这个设置面板更改你的邮箱，但只会影响GoToSocial用来联系你的邮箱，
					不会影响你用来登录的邮箱。
					<br/>
					要更改你用来登录的邮箱，请联系你的OIDC提供者。
				</p> }
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/user_guide/settings/#email-change"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于此设置的信息（在新标签页中打开）
				</a>
			</div>

			{ (user.unconfirmed_email && user.unconfirmed_email !== user.email) && <>
				<div className="info">
					<i className="fa fa-fw fa-info-circle" aria-hidden="true"></i>
					<b>
						你已发起邮箱地址更改，请检查你的邮箱收件箱。
						<br />
						你当前有一个待确认的邮箱地址更改，地址为：{user.unconfirmed_email}
						<br />
						要将{user.unconfirmed_email}确认为你的新邮箱地址，请检查你的邮箱收件箱。
					</b>
				</div>
			</> }

			<TextInput
				type="email"
				name="current-email"
				field={form.currentEmail}
				label="当前邮箱地址"
				autoComplete="none"
				disabled={true}
			/>

			<TextInput
				type="password"
				name="password"
				field={form.password}
				label="当前密码"
				autoComplete="current-password"
			/>

			<TextInput
				type="email"
				name="new-email"
				field={form.newEmail}
				label="新邮箱地址"
				autoComplete="none"
			/>
			
			<MutationButton
				disabled={!form.password || !form.newEmail || !form.newEmail.valid}
				label="更改邮箱地址"
				result={result}
			/>
		</form>
	);
}