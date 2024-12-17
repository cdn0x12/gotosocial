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
import { useImportDataMutation } from "../../../lib/query/user/export-import";
import MutationButton from "../../../components/form/mutation-button";
import useFormSubmit from "../../../lib/form/submit";
import { useFileInput, useTextInput } from "../../../lib/form";
import { FileInput, Select } from "../../../components/form/inputs";

export default function Import() {
	const form = {
		data: useFileInput("data"),
		type: useTextInput("type", { defaultValue: "" }),
		mode: useTextInput("mode", { defaultValue: "" })
	};

	const [submitForm, result] = useFormSubmit(form, useImportDataMutation(), {
		changedOnly: false,
		onFinish: () => {
			form.data.reset();
			form.type.reset();
			form.mode.reset();
		}
	});
	
	return (
		<form className="import-data" onSubmit={submitForm}>
			<div className="form-section-docs">
				<h3>导入数据</h3>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/user_guide/settings/#import"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多关于此部分的信息（在新标签页中打开）
				</a>
			</div>
			
			<FileInput
				label="CSV 数据文件"
				field={form.data}
				accept="text/csv"
			/>

			<Select
				field={form.type}
				label="导入类型"
				options={
					<>
						<option value="">- 选择导入类型 -</option>
						<option value="following">关注列表</option>
						<option value="blocks">账户屏蔽列表</option>
					</>
				}>
			</Select>

			<Select
				field={form.mode}
				label="导入模式"
				options={
					<>
						<option value="">- 选择导入模式 -</option>
						<option value="merge">合并（推荐）：添加到现有记录</option>
						<option value="overwrite">覆盖：替换现有记录</option>
					</>
				}>
			</Select>

			<MutationButton
				disabled={
					form.data.value === undefined ||
					!form.type.value ||
					!form.mode.value
				}
				label="导入"
				result={result}
			/>
		</form>
	);
}
