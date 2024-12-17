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
import {
	useExportFollowingMutation,
	useExportFollowersMutation,
	useExportListsMutation,
	useExportBlocksMutation,
	useExportMutesMutation,
} from "../../../lib/query/user/export-import";
import MutationButton from "../../../components/form/mutation-button";
import useFormSubmit from "../../../lib/form/submit";
import { useValue } from "../../../lib/form";
import { AccountExportStats } from "../../../lib/types/account";

export default function Export({ exportStats }: { exportStats: AccountExportStats }) {
	const [exportFollowing, exportFollowingResult] = useFormSubmit(
		// Use a dummy value.
		{ type: useValue("exportFollowing", "exportFollowing") },
		// Mutation we're wrapping.
		useExportFollowingMutation(),
		// Form never changes but
		// we want to always trigger.
		{ changedOnly: false },
	);

	const [exportFollowers, exportFollowersResult] = useFormSubmit(
		// Use a dummy value.
		{ type: useValue("exportFollowers", "exportFollowers") },
		// Mutation we're wrapping.
		useExportFollowersMutation(),
		// Form never changes but
		// we want to always trigger.
		{ changedOnly: false },
	);

	const [exportLists, exportListsResult] = useFormSubmit(
		// Use a dummy value.
		{ type: useValue("exportLists", "exportLists") },
		// Mutation we're wrapping.
		useExportListsMutation(),
		// Form never changes but
		// we want to always trigger.
		{ changedOnly: false },
	);


	const [exportBlocks, exportBlocksResult] = useFormSubmit(
		// Use a dummy value.
		{ type: useValue("exportBlocks", "exportBlocks") },
		// Mutation we're wrapping.
		useExportBlocksMutation(),
		// Form never changes but
		// we want to always trigger.
		{ changedOnly: false },
	);

	const [exportMutes, exportMutesResult] = useFormSubmit(
		// Use a dummy value.
		{ type: useValue("exportMutes", "exportMutes") },
		// Mutation we're wrapping.
		useExportMutesMutation(),
		// Form never changes but
		// we want to always trigger.
		{ changedOnly: false },
	);
	
	return (
		<form className="export-data">
			<div className="form-section-docs">
				<h3>导出数据</h3>
				<a
					href="https://docs.gotosocial.org/zh-cn/latest/user_guide/settings/#export"
					target="_blank"
					className="docslink"
					rel="noreferrer"
				>
				了解更多关于此部分的信息（在新标签页中打开）
				</a>
			</div>
			
			<div className="export-buttons-wrapper">
				<div className="stats-and-button">
					<span className="text-cutoff">
						关注了 {exportStats.following_count} 个账户
					</span>
					<MutationButton
						className="text-cutoff"
						label="下载 following.csv"
						type="button"
						onClick={() => exportFollowing()}
						result={exportFollowingResult}
						showError={true}
						disabled={exportStats.following_count === 0}
					/>
				</div>
				<div className="stats-and-button">
					<span className="text-cutoff">
						被 {exportStats.followers_count} 个账户关注
					</span>
					<MutationButton
						className="text-cutoff"
						label="下载 followers.csv"
						type="button"
						onClick={() => exportFollowers()}
						result={exportFollowersResult}
						showError={true}
						disabled={exportStats.followers_count === 0}
					/>
				</div>
				<div className="stats-and-button">
					<span className="text-cutoff">
						创建了 {exportStats.lists_count} 个列表
					</span>
					<MutationButton
						className="text-cutoff"
						label="下载 lists.csv"
						type="button"
						onClick={() => exportLists()}
						result={exportListsResult}
						showError={true}
						disabled={exportStats.lists_count === 0}
					/>
				</div>
				<div className="stats-and-button">
					<span className="text-cutoff">
						屏蔽了 {exportStats.blocks_count} 个账户
					</span>
					<MutationButton
						className="text-cutoff"
						label="下载 blocks.csv"
						type="button"
						onClick={() => exportBlocks()}
						result={exportBlocksResult}
						showError={true}
						disabled={exportStats.blocks_count === 0}
					/>
				</div>
				<div className="stats-and-button">
					<span className="text-cutoff">
						静音了 {exportStats.mutes_count} 个账户
					</span>
					<MutationButton
						className="text-cutoff"
						label="下载 mutes.csv"
						type="button"
						onClick={() => exportMutes()}
						result={exportMutesResult}
						showError={true}
						disabled={exportStats.mutes_count === 0}
					/>
				</div>
			</div>
		</form>
	);
}
