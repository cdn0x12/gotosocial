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

import MutationButton from "../../../../components/form/mutation-button";
import { useClearCachesMutation } from "../../../../lib/query/admin/debug";

export default function Caches({}) {
	const [clearCaches, clearCachesResult] = useClearCachesMutation();
	function submit(e) {
		e.preventDefault();
		clearCaches();
	}

	return (
		<div className="admin-debug-caches">
			<form onSubmit={submit}>
				<div className="form-section-docs">
					<h2>清理缓存</h2>
					<p>
						清理内部内存缓存
						<br/>
						这对于检查缓存内存使用情况或清除数据库缓存结果非常有用。
					</p>
				</div>
				<MutationButton
					disabled={false}
					label="清理缓存"
					result={clearCachesResult}
				/>
			</form>
		</div>
	);
}
