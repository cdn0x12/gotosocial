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
import Export from "./export";
import Loading from "../../../components/loading";
import { Error } from "../../../components/error";
import { useExportStatsQuery } from "../../../lib/query/user/export-import";
import Import from "./import";

export default function ExportImport() {
	const {
		data: exportStats,
		isLoading,
		isFetching,
		isError,
		error,
	} = useExportStatsQuery();

	if (isLoading || isFetching) {
		return <Loading />;
	}

	if (isError) {
		return <Error error={error} />;
	}

	if (exportStats === undefined) {
		throw "undefined account export stats";
	}
	
	return (
		<>
			<h1>导出 & 导入</h1>
			<p>
				在此页面，您可以导出您的 GoToSocial 账户数据，或导入数据到您的 GoToSocial 账户。所有导出和导入都使用与 Mastodon 兼容的 CSV 文件。
			</p>
			<Export exportStats={exportStats} />
			<Import />
		</>
	);
}
