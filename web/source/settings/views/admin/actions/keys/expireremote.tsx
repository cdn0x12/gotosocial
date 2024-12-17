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
import { TextInput } from "../../../../components/form/inputs";
import MutationButton from "../../../../components/form/mutation-button";
import { useTextInput } from "../../../../lib/form";
import { useInstanceKeysExpireMutation } from "../../../../lib/query/admin/actions";
import { formDomainValidator } from "../../../../lib/util/formvalidators";

export default function ExpireRemote({}) {
	const domainField = useTextInput("domain", {
		validator: formDomainValidator,
	});

	const [expire, expireResult] = useInstanceKeysExpireMutation();

	function submitExpire(e) {
		e.preventDefault();
		expire(domainField.value);
	}

	return (
		<form onSubmit={submitExpire}>
			<div className="form-section-docs">
				<h2>轮转外站实例密钥</h2>
				<p>
					将给定外站实例的所有公钥标记为过期。
					<br/>
					这在外站实例需要轮转密钥（例如安全问题、数据泄露、例行安全程序等），而您的实例无法再与它们正常通信时非常有用。
					<br/>
					一个被标记为过期的密钥将在下次请求时被重新懒加载。
				</p>
			</div>
			<TextInput
				field={domainField}
				label="域名"
				type="text"
				autoCapitalize="none"
				spellCheck="false"
				placeholder="example.org"
			/>
			<MutationButton
				disabled={!domainField.value || !domainField.valid}
				label="轮转密钥"
				result={expireResult}
			/>
		</form>
	);
}
