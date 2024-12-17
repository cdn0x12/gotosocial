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

import React, { useMemo, useState } from "react";
import { Link } from "wouter";
import { matchSorter } from "match-sorter";
import NewEmojiForm from "./new-emoji";
import { useTextInput } from "../../../../lib/form";
import { useEmojiByCategory } from "../category-select";
import Loading from "../../../../components/loading";
import { Error } from "../../../../components/error";
import { TextInput } from "../../../../components/form/inputs";
import { useListEmojiQuery } from "../../../../lib/query/admin/custom-emoji";
import { CustomEmoji } from "../../../../lib/types/custom-emoji";

export default function EmojiOverview() {
	const { data: emoji = [], isLoading, isError, error } = useListEmojiQuery({ filter: "domain:local" });

	let content: React.JSX.Element;
	if (isLoading) {
		content = <Loading />;
	} else if (isError) {
		content = <Error error={error} />;
	} else {
		content = (
			<>
				<EmojiList emoji={emoji} />
				<NewEmojiForm />
			</>
		);
	}

	return (
		<>
			<h1>本站自定义表情</h1>
			<p>
				要在你的嘟文中使用自定义表情，它们必须被“本地化”到你的实例。
				您可以直接在此处上传，或通过 <Link to={`/remote`}>外站表情</Link> 页面从其他（已知）实例复制。
			</p>
			<p>
				<strong>警告！</strong> 如果您上传超过 300-400 个自定义表情，
				且用户和客户端尝试一次性加载所有表情图像（这是许多客户端的做法），
				可能会导致速率限制问题。
			</p>
			{content}
		</>
	);
}

interface EmojiListParams {
	emoji: CustomEmoji[];
}

function EmojiList({ emoji }: EmojiListParams) {
	const filterField = useTextInput("filter");
	const filter = filterField.value ?? "";
	const emojiByCategory = useEmojiByCategory(emoji);

	// Filter emoji based on shortcode match
	// with user input, hiding empty categories.
	const { filteredEmojis, filteredCount } = useMemo(() => {
		// Amount of emojis removed by the filter.
		// Start with the length of the array since
		// that's the max that can be filtered out.
		let filteredCount = emoji.length;
		
		// Results of the filtering.
		const filteredEmojis: [string, CustomEmoji[]][] = [];
		
		// Filter from emojis in this category.
		emojiByCategory.forEach((entries, category) => {
			const filteredEntries = matchSorter(entries, filter, {
				keys: ["shortcode"]
			});

			if (filteredEntries.length == 0) {
				// Nothing left in this category, don't
				// bother adding it to filteredEmojis.
				return;
			}

			filteredCount -= filteredEntries.length;
			filteredEmojis.push([category, filteredEntries]);
		});

		return { filteredEmojis, filteredCount };
	}, [filter, emojiByCategory, emoji.length]);

	return (
		<>
			<h2>概览</h2>
			{emoji.length > 0
				? <span>{emoji.length} 个自定义表情 {filteredCount > 0 && `(${filteredCount} 已过滤)`}</span>
				: <span>还没有自定义表情，你可以点击下方按钮添加。</span>
			}
			<div className="list emoji-list">
				<div className="header">
					<TextInput
						field={filterField}
						name="emoji-shortcode"
						placeholder="搜索"
						autoCapitalize="none"
						spellCheck="false"
					/>
				</div>
				<div className="entries scrolling">
					{filteredEmojis.length > 0
						? (
							<div className="entries scrolling">
								{filteredEmojis.map(([category, emojis]) => {
									return <EmojiCategory key={category} category={category} emojis={emojis} />;
								})}
							</div>
						)
						: <div className="entry">没有匹配到任何自定义表情。</div>
					}
				</div>
			</div>
		</>
	);
}

interface EmojiCategoryProps {
	category: string;
	emojis: CustomEmoji[];
}

function EmojiCategory({ category, emojis }: EmojiCategoryProps) {
	return (
		<div className="entry">
			<b>{category}</b>
			<div className="emoji-group">
				{emojis.map((emoji) => {
					return (
						<Link key={emoji.id} to={`/local/${emoji.id}`} >
							<EmojiPreview emoji={emoji} />
						</Link>
					);
				})}
			</div>
		</div>
	);
}

function EmojiPreview({ emoji }) {
	const [ animate, setAnimate ] = useState(false);

	return (
		<img
			onMouseEnter={() => { setAnimate(true); }}
			onMouseLeave={() => { setAnimate(false); }}
			src={animate ? emoji.url : emoji.static_url}
			alt={emoji.shortcode}
			title={emoji.shortcode}
			loading="lazy"
		/>
	);
}
