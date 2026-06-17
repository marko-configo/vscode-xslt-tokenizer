import * as path from 'path';

export function resolvePathRelativeToDocument(href: string, documentPath: string): string {
	if (path.isAbsolute(href)) {
		return href;
	} else if (href.startsWith('file:///')) {
		return href.substring(7);
	} else if (href.startsWith('file:/')) {
		return href.substring(5);
	} else {
		href = href.startsWith('file:') ? href.substring(5) : href;
		const basePath = path.dirname(documentPath);
		return path.normalize(path.join(basePath, href));
	}
}

export function resolveImportHref(
	href: string,
	documentPath: string,
	importPaths: string[],
	workspaceFolder: string | undefined,
	exists: (filePath: string) => boolean
): string {
	const defaultPath = resolvePathRelativeToDocument(href, documentPath);
	if (exists(defaultPath)) {
		return defaultPath;
	}

	if (workspaceFolder) {
		for (const importPath of importPaths) {
			const candidate = path.normalize(path.join(workspaceFolder, importPath, href));
			if (exists(candidate)) {
				return candidate;
			}
		}
	}

	return defaultPath;
}
