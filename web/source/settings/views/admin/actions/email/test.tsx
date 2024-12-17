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
import { TextInput } from "../../../../components/form/inputs";
import MutationButton from "../../../../components/form/mutation-button";
import { useTextInput } from "../../../../lib/form";
import { useSendTestEmailMutation } from "../../../../lib/query/admin/actions";
import { useInstanceV1Query } from "../../../../lib/query/gts-api";
import useFormSubmit from "../../../../lib/form/submit";

export default function Test({}) {
	const { data: instance } = useInstanceV1Query();

	const form = {
		email: useTextInput("email", { defaultValue: instance?.email }),
		message: useTextInput("message")
	};

	const [submit, result] = useFormSubmit(form, useSendTestEmailMutation(), { changedOnly: false });

	return (
		<form onSubmit={submit}>
			<div className="form-section-docs">
				<h2>发送测试邮件</h2>
				<p>
					为了检查您的实例邮件配置是否正确，您可以尝试向给定地址发送测试邮件，并附带可选消息。
					<br/>
					如果您的实例未配置 SMTP，此操作将不会执行。
				</p>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/configuration/smtp/"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于 SMTP 配置的信息 (在新标签页中打开)
				</a>
			</div>
			<TextInput
				field={form.email}
				label="邮箱"
				placeholder="someone@example.org"
				// Get email validation for free.
				type="email"
				required={true}
			/>
			<TextInput
				field={form.message}
				label="消息 (可选)"
				placeholder="请忽略此测试邮件，谢谢！"
			/>
			<MutationButton
				disabled={!form.email.value}
				label="发送"
				result={result}
			/>
		</form>
	);
}
