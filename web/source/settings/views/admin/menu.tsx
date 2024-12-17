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

import { MenuItem } from "../../lib/navigation/menu";
import React from "react";
import { useHasPermission, useInstanceDebug } from "../../lib/navigation/util";

/*
	EXPORTED COMPONENTS
*/

/**
 * - /settings/admin/instance/settings
 * - /settings/admin/instance/rules
 * - /settings/admin/instance/rules/:ruleId
 * - /settings/admin/emojis
 * - /settings/admin/emojis/local
 * - /settings/admin/emojis/local/:emojiId
 * - /settings/admin/emojis/remote
 * - /settings/admin/actions
 * - /settings/admin/actions/email
 * - /settings/admin/actions/media
 * - /settings/admin/actions/keys
 * - /settings/admin/http-header-permissions/blocks
 * - /settings/admin/http-header-permissions/blocks/:blockId\
 * - /settings/admin/http-header-permissions/allows
 * - /settings/admin/http-header-permissions/allows/:allowId
 */
export default function AdminMenu() {	
	const permissions = ["admin"];
	const admin = useHasPermission(permissions);
	if (!admin) {
		return null;
	}
	
	return (
		<MenuItem
			name="管理"
			itemUrl="admin"
			defaultChild="actions"
			permissions={permissions}
		>
			<AdminInstanceMenu />
			<AdminEmojisMenu />
			<AdminActionsMenu />
			<AdminHTTPHeaderPermissionsMenu />
			<AdminDebugMenu />
		</MenuItem>
	);
}

/*
	INTERNAL COMPONENTS
*/

function AdminInstanceMenu() {
	return (
		<MenuItem
			name="实例"
			itemUrl="instance"
			defaultChild="settings"
			icon="fa-sitemap"
		>
			<MenuItem
				name="设置"
				itemUrl="settings"
				icon="fa-sliders"
			/>
			<MenuItem
				name="规则"
				itemUrl="rules"
				icon="fa-dot-circle-o"
			/>
		</MenuItem>
	);
}

function AdminActionsMenu() {
	return (
		<MenuItem
			name="操作"
			itemUrl="actions"
			defaultChild="email"
			icon="fa-bolt"
		>
			<MenuItem
				name="邮件"
				itemUrl="email"
				icon="fa-email-bulk"
			/>
			<MenuItem
				name="媒体"
				itemUrl="media"
				icon="fa-photo"
			/>
			<MenuItem
				name="密钥"
				itemUrl="keys"
				icon="fa-key-modern"
			/>
		</MenuItem>
	);
}

function AdminEmojisMenu() {
	return (
		<MenuItem
			name="自定义表情"
			itemUrl="emojis"
			defaultChild="local"
			icon="fa-smile-o"
		>
			<MenuItem
				name="本站"
				itemUrl="local"
				icon="fa-home"
			/>
			<MenuItem
				name="外站"
				itemUrl="remote"
				icon="fa-cloud"
			/>
		</MenuItem>
	);
}

function AdminHTTPHeaderPermissionsMenu() {
	return (
		<MenuItem
			name="HTTP 请求头权限"
			itemUrl="http-header-permissions"
			defaultChild="blocks"
			icon="fa-hubzilla"
		>
			<MenuItem
				name="屏蔽"
				itemUrl="blocks"
				icon="fa-close"
			/>
			<MenuItem
				name="放行"
				itemUrl="allows"
				icon="fa-check"
			/>
		</MenuItem>
	);
}

function AdminDebugMenu() {
	// Don't attach this menu if instance
	// is not running in debug mode.
	const debug = useInstanceDebug();
	if (!debug) {
		return null;
	}
	
	return (
		<MenuItem
			name="调试"
			itemUrl="debug"
			defaultChild="apurl"
			icon="fa-bug"
		>
			<MenuItem
				name="AP URL"
				itemUrl="apurl"
				icon="fa-file-code-o"
			/>
			<MenuItem
				name="缓存"
				itemUrl="caches"
				icon="fa-archive"
			/>
		</MenuItem>
	);
}
