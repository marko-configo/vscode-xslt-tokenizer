import * as path from 'path';
import { resolveImportHref } from '../src/resolveImportHref';

describe('resolveImportHref', () => {
	const workspaceRoot = path.join(__dirname, '..', 'sample', 'import-paths');
	const stylesheetPath = path.join(workspaceRoot, 'recipe', 'main.xsl');
	const sharedInclude = path.join(workspaceRoot, 'shared', 'include', 'helper.xsl');

	test('resolves href relative to the stylesheet when the file exists', () => {
		const localStylesheet = path.join(workspaceRoot, 'local', 'main.xsl');
		const expected = path.join(workspaceRoot, 'local', 'include', 'helper.xsl');

		const resolved = resolveImportHref(
			'include/helper.xsl',
			localStylesheet,
			['shared'],
			workspaceRoot,
			(filePath) => filePath === expected
		);

		expect(resolved).toBe(expected);
	});

	test('falls back to configured import paths when the local href does not exist', () => {
		const resolved = resolveImportHref(
			'include/helper.xsl',
			stylesheetPath,
			['shared'],
			workspaceRoot,
			(filePath) => filePath === sharedInclude
		);

		expect(resolved).toBe(sharedInclude);
	});

	test('returns the local path when no configured import path matches', () => {
		const expected = path.join(workspaceRoot, 'recipe', 'include', 'helper.xsl');

		const resolved = resolveImportHref(
			'include/helper.xsl',
			stylesheetPath,
			[],
			workspaceRoot,
			() => false
		);

		expect(resolved).toBe(expected);
	});
});
