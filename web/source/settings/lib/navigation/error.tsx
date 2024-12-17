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

import React, { Component, ReactNode } from "react";


interface ErrorBoundaryProps {
	children?: ReactNode;
}

interface ErrorBoundaryState {
	hadError?: boolean;
	componentStack?;
	error?;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	resetErrorBoundary: () => void;

	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {};
		this.resetErrorBoundary = () => {
			this.setState({});
		};
	}

	static getDerivedStateFromError(error) {
		return { hadError: true, error };
	}

	componentDidCatch(_e, info) {
		this.setState({
			...this.state,
			componentStack: info.componentStack
		});
	}

	render() {
		if (this.state.hadError) {
			return (
				<ErrorFallback
					error={this.state.error}
					componentStack={this.state.componentStack}
					resetErrorBoundary={this.resetErrorBoundary}
				/>
			);
		} else {
			return this.props.children;
		}
	}
}

function ErrorFallback({ error, componentStack, resetErrorBoundary }) {
	return (
		<div className="error">
			<p>
				{"发生错误，请在 "}
				<a href="https://github.com/superseriousbusiness/gotosocial/issues">GoToSocial 问题追踪看板</a>
				{" 或 "}
				<a href="https://matrix.to/#/#gotosocial-help:superseriousbusiness.org">Matrix 支持房间</a>
				{" 报告此问题。"}
				<br />{"请包含以下详细信息："}
			</p>
			<div className="details">
				<pre>
					{error.name}: {error.message}

					{componentStack && [
						"\n\nComponent trace:",
						componentStack
					]}
					{["\n\nError trace: ", error.stack]}
				</pre>
			</div>
			<p>
				<button onClick={resetErrorBoundary}>重试</button> 或 <a href="">刷新页面</a>
			</p>
		</div>
	);
}

export { ErrorBoundary };
