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
import { AccountSearchForm } from "./search";

export default function AccountsSearch({ }) {
	return (
		<div className="accounts-view">
			<div className="form-section-docs">
				<h1>搜索账户</h1>
				<p>
					你可以通过点击举报中的账户名称或使用下面的表单搜索账户，然后点击其名称。
					<br/>
					以下表单中的所有字段都是可选的。
				</p>
			</div>
			<AccountSearchForm />
		</div>
	);
}
