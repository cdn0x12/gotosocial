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

import FormWithData from "../../lib/form/form-with-data";

import { useVerifyCredentialsQuery } from "../../lib/query/oauth";
import { useArrayInput, useTextInput } from "../../lib/form";
import { TextInput } from "../../components/form/inputs";
import useFormSubmit from "../../lib/form/submit";
import MutationButton from "../../components/form/mutation-button";
import { useAliasAccountMutation, useMoveAccountMutation } from "../../lib/query/user";
import { FormContext, useWithFormContext } from "../../lib/form/context";
import { store } from "../../redux/store";

export default function UserMigration() {
	return (
		<FormWithData
			dataQuery={useVerifyCredentialsQuery}
			DataForm={UserMigrationForm}
		/>
	);
}

function UserMigrationForm({ data: profile }) {
	return (
		<>
			<h2>账户迁移设置</h2>
			<p>
				以下设置允许你设置<strong>账户别名</strong>，将你的账户链接到其他账户，或<strong>迁移</strong>到其他账户。
			</p>
			<p>
				账户<strong>别名</strong>是安全的，可以随时设置和取消，最多可以设置五个账户别名。
			</p>
			<p>
				账户<strong>迁移</strong>操作会带来一系列的后果，请谨慎操作。
			</p>
			<p>
				更多关于账户迁移的信息，请参阅<a href="https://docs.gotosocial.org/zh-cn/latest/user_guide/settings/#migration" target="_blank" className="docslink" rel="noreferrer">文档</a>。
			</p>
			<AliasForm data={profile} />
			<MoveForm data={profile} />
		</>
	);
}

function AliasForm({ data: profile }) {
	const form = {
		alsoKnownAs: useArrayInput("also_known_as_uris", {
			source: profile,
			valueSelector: (p) => (
				p.source?.also_known_as_uris
					? p.source?.also_known_as_uris.map(entry => [entry])
					: []
			),
			length: 5,
		}),
	};

	const [submitForm, result] = useFormSubmit(form, useAliasAccountMutation());
	
	return (
		<form className="user-migration-alias" onSubmit={submitForm}>
			<div className="form-section-docs">
				<h3>账户别名</h3>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/user_guide/migration"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于账户迁移的信息（在新标签页中打开）
				</a>
			</div>
			<AlsoKnownAsURIs
				field={form.alsoKnownAs}
			/>
			<MutationButton
				disabled={false}
				label="保存账户别名"
				result={result}
			/>
		</form>
	);
}

function AlsoKnownAsURIs({ field: formField }) {	
	return (
		<div className="aliases">
			<FormContext.Provider value={formField.ctx}>
				{formField.value.map((data, i) => (
					<AlsoKnownAsURI
						key={i}
						index={i}
						data={data}
					/>
				))}
			</FormContext.Provider>
		</div>
	);
}

function AlsoKnownAsURI({ index, data }) {	
	const name = `${index}`;
	const form = useWithFormContext(index, {
		alsoKnownAsURI: useTextInput(
			name,
			// Only one field per entry.
			{ defaultValue: data[0] ?? "" },
		),
	}); 

	return (
		<TextInput
			label={`别名 #${index+1}`}
			field={form.alsoKnownAsURI}
			placeholder={`https://example.org/users/my_other_account_${index+1}`}
			type="url"
			pattern="(http|https):\/\/.+"
		/>
	);
}

function MoveForm({ data: profile }) {
	let urlStr = store.getState().oauth.instanceUrl ?? "";
	let url = new URL(urlStr);
	
	const form = {
		movedToURI: useTextInput("moved_to_uri", {
			source: profile,
			valueSelector: (p) => p.moved?.url },
		),
		password: useTextInput("password"),
	};

	const [submitForm, result] = useFormSubmit(form, useMoveAccountMutation(), {
		changedOnly: false,
	});
	
	return (
		<form className="user-migration-move" onSubmit={submitForm}>
			<div className="form-section-docs">
				<h3>迁移账户</h3>
				<p>
					要成功迁移账户，你必须先设置账户别名，将迁移的目标账户链接到你当前的账户（即你正在迁移的账户），
					这需要在目标账户所在实例的设置面板中进行。为此，请提供以下信息： 
				</p>
				<dl className="migration-details">
					<div>
						<dt>账户名/用户名:</dt>
						<dd>@{profile.acct}@{url.host}</dd>
					</div>
					<div>
						<dt>账户URI:</dt>
						<dd>{urlStr}/users/{profile.username}</dd>
					</div>
				</dl>
				<br/>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/user_guide/migration"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于账户迁移的信息（在新标签页中打开）
				</a>
			</div>
			<TextInput
				disabled={false}
				field={form.movedToURI}
				label="迁移目标URI"
				placeholder="https://example.org/users/my_new_account"
				type="url"
				pattern="(http|https):\/\/.+"
			/>
			<TextInput
				disabled={false}
				type="password"
				autoComplete="current-password"
				name="password"
				field={form.password}
				label="当前账户密码"
			/>
			<MutationButton
				disabled={false}
				label="确认账户迁移"
				result={result}
			/>
		</form>
	);
}
