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

import {
	useTextInput,
	useFileInput,
	useBoolInput,
	useFieldArrayInput,
} from "../../lib/form";

import useFormSubmit from "../../lib/form/submit";
import { useWithFormContext, FormContext } from "../../lib/form/context";

import {
	TextInput,
	TextArea,
	FileInput,
	Checkbox,
	Select
} from "../../components/form/inputs";

import FormWithData from "../../lib/form/form-with-data";
import FakeProfile from "../../components/profile";
import MutationButton from "../../components/form/mutation-button";

import { useAccountThemesQuery } from "../../lib/query/user";
import { useUpdateCredentialsMutation } from "../../lib/query/user";
import { useVerifyCredentialsQuery } from "../../lib/query/oauth";
import { useInstanceV1Query } from "../../lib/query/gts-api";
import { Account } from "../../lib/types/account";

export default function UserProfile() {
	return (
		<FormWithData
			dataQuery={useVerifyCredentialsQuery}
			DataForm={UserProfileForm}
		/>
	);
}

interface UserProfileFormProps {
	data: Account;
}

function UserProfileForm({ data: profile }: UserProfileFormProps) {
	/*
		User profile update form keys
		- bool bot
		- bool locked
		- string display_name
		- string note
		- file avatar
		- file header
		- bool enable_rss
		- bool hide_collections
		- string custom_css (if enabled)
		- string theme
	*/

	const { data: instance } = useInstanceV1Query();
	const instanceConfig = React.useMemo(() => {
		return {
			allowCustomCSS: instance?.configuration?.accounts?.allow_custom_css === true,
			maxPinnedFields: instance?.configuration?.accounts?.max_profile_fields ?? 6
		};
	}, [instance]);
	
	// Parse out available theme options into nice format.
	const { data: themes } = useAccountThemesQuery();
	const themeOptions = useMemo(() => {
		let themeOptions = [
			<option key="" value="">
				默认
			</option>
		];

		themes?.forEach((theme) => {
			const value = theme.file_name;
			let text = theme.title;
			if (theme.description) {
				text += " - " + theme.description;
			}
			themeOptions.push(
				<option key={value} value={value}>
					{text}
				</option>
			);
		});

		return themeOptions;
	}, [themes]);

	const form = {
		avatar: useFileInput("avatar", { withPreview: true }),
		avatarDescription: useTextInput("avatar_description", { source: profile }),
		header: useFileInput("header", { withPreview: true }),
		headerDescription: useTextInput("header_description", { source: profile }),
		displayName: useTextInput("display_name", { source: profile }),
		note: useTextInput("note", { source: profile, valueSelector: (p) => p.source?.note }),
		bot: useBoolInput("bot", { source: profile }),
		locked: useBoolInput("locked", { source: profile }),
		discoverable: useBoolInput("discoverable", { source: profile}),
		enableRSS: useBoolInput("enable_rss", { source: profile }),
		hideCollections: useBoolInput("hide_collections", { source: profile }),
		webVisibility: useTextInput("web_visibility", { source: profile, valueSelector: (p) => p.source?.web_visibility }),
		fields: useFieldArrayInput("fields_attributes", {
			defaultValue: profile?.source?.fields,
			length: instanceConfig.maxPinnedFields
		}),
		customCSS: useTextInput("custom_css", { source: profile, nosubmit: !instanceConfig.allowCustomCSS }),
		theme: useTextInput("theme", { source: profile }),
	};

	const [submitForm, result] = useFormSubmit(form, useUpdateCredentialsMutation(), {
		changedOnly: true,
		onFinish: () => {
			form.avatar.reset();
			form.header.reset();
		}
	});

	const noAvatarSet = !profile.avatar_media_id;
	const noHeaderSet = !profile.header_media_id;

	return (
		<form className="user-profile" onSubmit={submitForm}>
			<h1>个人资料</h1>
			<div className="overview">
				<FakeProfile
					avatar={form.avatar.previewValue ?? profile.avatar}
					header={form.header.previewValue ?? profile.header}
					display_name={form.displayName.value ?? profile.username}
					bot={profile.bot}
					username={profile.username}
					role={profile.role}
				/>

				<fieldset className="file-input-with-image-description">
					<legend>封面</legend>
					<FileInput
						label="上传文件"
						field={form.header}
						accept="image/png, image/jpeg, image/webp, image/gif"
					/>
					<TextInput
						field={form.headerDescription}
						label="图片描述; 仅在未使用默认封面时可设置"
						placeholder="一片绿色的草地，上面开满了粉色的花朵。"
						autoCapitalize="sentences"
						disabled={noHeaderSet && !form.header.value}
					/>
				</fieldset>
				
				<fieldset className="file-input-with-image-description">
					<legend>头像</legend>
					<FileInput
						label="上传文件 (1:1的图片效果最佳)"
						field={form.avatar}
						accept="image/png, image/jpeg, image/webp, image/gif"
					/>
					<TextInput
						field={form.avatarDescription}
						label="图片描述; 仅在未使用默认头像时可设置"
						placeholder="一只可爱的树懒。"
						autoCapitalize="sentences"
						disabled={noAvatarSet && !form.avatar.value}
					/>
				</fieldset>

				<div className="theme">
					<div>
						<b id="theme-label">主题</b>
						<br/>
						<span>选择主题并保存后，<a href={profile.url} target="_blank">打开你的账户页</a>并刷新即可查看更改。</span>
					</div>
					<Select
						aria-labelledby="theme-label"
						field={form.theme}
						options={<>{themeOptions}</>}
					/>
				</div>
			</div>

			<div className="form-section-docs">
				<h3>基本信息</h3>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/user_guide/settings/#basic-information"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于这些设置的信息（在新标签页中打开）
				</a>
			</div>
			<Checkbox
				field={form.bot}
				label="将此账户标记为机器人账户; 这表明该账户的操作是自动进行的"
			/>
			<TextInput
				field={form.displayName}
				label="昵称"
				placeholder="一个GoToSocial用户"
				autoCapitalize="words"
				spellCheck="false"
			/>
			<TextArea
				field={form.note}
				label="个人简介"
				placeholder="我是树懒，我喜欢快速移动。"
				autoCapitalize="sentences"
				rows={8}
			/>
			<fieldset>
				<legend>属性</legend>
				<ProfileFields
					field={form.fields}
				/>
			</fieldset>

			<div className="form-section-docs">
				<h3>可见性与隐私</h3>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/user_guide/settings/#visibility-and-privacy"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于这些设置的信息（在新标签页中打开）
				</a>
			</div>
			<Select
				field={form.webVisibility}
				label="在个人资料和RSS订阅中显示的嘟文可见性范围。"
				options={
					<>
						<option value="public">仅显示公开嘟文（GoToSocial默认）</option>
						<option value="unlisted">显示公开和未列出的嘟文（Mastodon默认）</option>
						<option value="none">不显示任何嘟文</option>
					</>
				}
			/>
			<Checkbox
				field={form.locked}
				label="手动批准关注请求。"
			/>
			<Checkbox
				field={form.discoverable}
				label="让账户可被搜索引擎和目录发现。"
			/>
			<Checkbox
				field={form.enableRSS}
				label="启用嘟文RSS订阅。"
			/>
			<Checkbox
				field={form.hideCollections}
				label="隐藏你的关注与粉丝详情。"
			/>

			<div className="form-section-docs">
				<h3>进阶设置</h3>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/user_guide/settings/#advanced"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于这些设置的信息（在新标签页中打开）
				</a>
			</div>
			<TextArea
				field={form.customCSS}
				label={`自定义CSS` + (!instanceConfig.allowCustomCSS ? ` (本实例未启用)` : ``)}
				className="monospace"
				rows={8}
				disabled={!instanceConfig.allowCustomCSS}
				autoCapitalize="none"
				spellCheck="false"
			/>
			<MutationButton
				disabled={false}
				label="保存个人资料信息"
				result={result}
			/>
		</form>
	);
}

function ProfileFields({ field: formField }) {
	return (
		<div className="fields">
			<FormContext.Provider value={formField.ctx}>
				{formField.value.map((data, i) => (
					<Field
						key={i}
						index={i}
						data={data}
					/>
				))}
			</FormContext.Provider>
		</div>
	);
}

function Field({ index, data }) {
	const form = useWithFormContext(index, {
		name: useTextInput("name", { defaultValue: data.name }),
		value: useTextInput("value", { defaultValue: data.value })
	});

	return (
		<div className="entry">
			<TextInput
				field={form.name}
				placeholder="属性名"
				autoCapitalize="none"
				spellCheck="false"
			/>
			<TextInput
				field={form.value}
				placeholder="属性值"
				autoCapitalize="none"
				spellCheck="false"
			/>
		</div>
	);
}
