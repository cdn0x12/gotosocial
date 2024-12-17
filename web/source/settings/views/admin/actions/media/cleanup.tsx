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

import { useTextInput } from "../../../../lib/form";
import { TextInput } from "../../../../components/form/inputs";
import MutationButton from "../../../../components/form/mutation-button";
import { useMediaCleanupMutation } from "../../../../lib/query/admin/actions";

export default function Cleanup({}) {
	const daysField = useTextInput("days", { defaultValue: "7" });

	const [mediaCleanup, mediaCleanupResult] = useMediaCleanupMutation();

	function submitCleanup(e) {
		e.preventDefault();
		mediaCleanup(daysField.value);
	}
    
	return (
		<form onSubmit={submitCleanup}>
			<div className="form-section-docs">
				<h2>清理</h2>
				<p>
					清理指定天数外的外站媒体。
					<br/>
					如果外站实例仍然在线，它们将在需要时被重新获取。
					<br/>
					也清理未使用的头和头像。
				</p>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/admin/media_caching/"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
					了解更多 (在新标签页中打开)
				</a>
			</div>
			<TextInput
				field={daysField}
				label="天数"
				type="number"
				min="0"
				placeholder="30"
			/>
			<MutationButton
				disabled={!daysField.value}
				label="清理旧媒体"
				result={mediaCleanupResult}
			/>
		</form>
	);
}
