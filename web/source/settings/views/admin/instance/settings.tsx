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

import { useTextInput, useFileInput } from "../../../lib/form";
import { TextInput, TextArea, FileInput } from "../../../components/form/inputs";
import MutationButton from "../../../components/form/mutation-button";
import { useInstanceV1Query } from "../../../lib/query/gts-api";
import { useUpdateInstanceMutation } from "../../../lib/query/admin";
import { InstanceV1 } from "../../../lib/types/instance";
import FormWithData from "../../../lib/form/form-with-data";
import useFormSubmit from "../../../lib/form/submit";

export default function InstanceSettings() {
	return (
		<FormWithData
			dataQuery={useInstanceV1Query}
			DataForm={InstanceSettingsForm}
		/>
	);
}

interface InstanceSettingsFormProps{
	data: InstanceV1;
}

function InstanceSettingsForm({ data: instance }: InstanceSettingsFormProps) {
	const titleLimit = 40;
	const shortDescLimit = 500;
	const descLimit = 5000;
	const termsLimit = 5000;

	const form = {
		title: useTextInput("title", {
			source: instance,
			validator: (val: string) => val.length <= titleLimit ? "" : `实例名为 ${val.length} 个字符；必须少于 ${titleLimit} 个字符`
		}),
		thumbnail: useFileInput("thumbnail", { withPreview: true }),
		thumbnailDesc: useTextInput("thumbnail_description", { source: instance }),
		shortDesc: useTextInput("short_description", {
			source: instance,
			// Select "raw" text version of parsed field for editing.
			valueSelector: (s: InstanceV1) => s.short_description_text,
			validator: (val: string) => val.length <= shortDescLimit ? "" : `实例简介为 ${val.length} 个字符；必须少于 ${shortDescLimit} 个字符`
		}),
		description: useTextInput("description", {
			source: instance,
			// Select "raw" text version of parsed field for editing.
			valueSelector: (s: InstanceV1) => s.description_text,
			validator: (val: string) => val.length <= descLimit ? "" : `实例描述为 ${val.length} 个字符；必须少于 ${descLimit} 个字符`
		}),
		customCSS: useTextInput("custom_css", {
			source: instance,
			valueSelector: (s: InstanceV1) => s.custom_css
		}),
		terms: useTextInput("terms", {
			source: instance,
			// Select "raw" text version of parsed field for editing.
			valueSelector: (s: InstanceV1) => s.terms_text,
			validator: (val: string) => val.length <= termsLimit ? "" : `实例条款为 ${val.length} 个字符；必须少于 ${termsLimit} 个字符`
		}),
		contactUser: useTextInput("contact_username", { source: instance, valueSelector: (s) => s.contact_account?.username }),
		contactEmail: useTextInput("contact_email", { source: instance, valueSelector: (s) => s.email })
	};

	const [submitForm, result] = useFormSubmit(form, useUpdateInstanceMutation());

	return (
		<form
			onSubmit={submitForm}
			autoComplete="none"
		>
			<h1>实例设置</h1>

			<div className="form-section-docs">
				<h3>外观</h3>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/admin/settings/#instance-appearance"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于这些设置的信息 (在新的标签页中打开)
				</a>
			</div>

			<TextInput
				field={form.title}
				label={`实例名称 (最多 ${titleLimit} 个字符)`}
				autoCapitalize="words"
				placeholder="我的 GoToSocial 实例"
			/>

			<div className="file-upload" aria-labelledby="avatar">
				<strong id="avatar">实例头像 (1:1 图像效果最佳)</strong>
				<div className="file-upload-with-preview">
					<img
						className="preview avatar"
						src={form.thumbnail.previewValue ?? instance?.thumbnail}
						alt={form.thumbnailDesc.value ?? (instance?.thumbnail ? `实例头像` : "未设置实例头像")}
					/>
					<div className="file-input-with-image-description">
						<FileInput
							field={form.thumbnail}
							accept="image/png, image/jpeg, image/webp, image/gif"
						/>
						<TextInput
							field={form.thumbnailDesc}
							label="头像图像描述"
							placeholder="一个可爱的微笑树懒图。"
							autoCapitalize="sentences"
						/>
					</div>
				</div>

			</div>

			<div className="form-section-docs">
				<h3>描述符</h3>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/admin/settings/#instance-descriptors"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于这些设置的信息 (在新的标签页中打开)
				</a>
			</div>

			<TextArea
				field={form.shortDesc}
				label={`实例简介 (接受 markdown，最多 ${shortDescLimit} 个字符)`}
				placeholder="一个用于测试的小型 GoToSocial 实例。"
				autoCapitalize="sentences"
				rows={6}
			/>

			<TextArea
				field={form.description}
				label={`实例描述 (接受 markdown，最多 ${descLimit} 个字符)`}
				placeholder="一个用于测试的小型 GoToSocial 实例。"
				autoCapitalize="sentences"
				rows={6}
			/>

			<TextArea
				field={form.terms}
				label={`实例条款（接受 markdown，最多 ${termsLimit} 个字符）`}
				placeholder="使用此实例的条款和条件，数据政策，版权规则，GDPR 等。"
				autoCapitalize="sentences"
				rows={6}
			/>

			<div className="form-section-docs">
				<h3>联系信息</h3>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/admin/settings/#instance-contact-info"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于这些设置的信息 (在新的标签页中打开)
				</a>
			</div>

			<TextInput
				field={form.contactUser}
				label="联络用户 (本站账户的用户名)"
				placeholder="admin"
				autoCapitalize="none"
				spellCheck="false"
			/>

			<TextInput
				field={form.contactEmail}
				label="联络邮箱"
				placeholder="admin@example.com"
				type="email"
			/>

			<TextArea
				field={form.customCSS}
				label="自定义 CSS"
				className="monospace"
				rows={8}
				autoCapitalize="none"
				spellCheck="false"
			/>

			<MutationButton label="保存" result={result} disabled={false} />
		</form>
	);
}
