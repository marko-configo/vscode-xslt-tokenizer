// tslint:disable
import { GlobalInstructionData, GlobalInstructionType } from "./xslLexer";
import * as vscode from "vscode";
import { LanguageConfiguration, XslLexer} from "./xslLexer";
import { XsltSymbolProvider } from './xsltSymbolProvider';
import * as url from 'url';

export class FullDocumentLinkProvider implements vscode.DocumentLinkProvider {

	private lexer: XslLexer;

	constructor(languageConfig: LanguageConfiguration) {
		this.lexer = new XslLexer(languageConfig);
	}

	provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.DocumentLink[] {
		this.lexer.analyse(document.getText());
		this.lexer.globalInstructionData;
		let data: GlobalInstructionData[] = this.lexer.globalInstructionData;

		let result: vscode.DocumentLink[] = [];
		data.forEach((instruction) => {
			if (instruction.type === GlobalInstructionType.Import || instruction.type === GlobalInstructionType.Include) {
				const resolvedPath = XsltSymbolProvider.resolvePath(instruction.name, document.fileName);
				const pathForUri = resolvedPath.startsWith('file:/') ? resolvedPath : url.pathToFileURL(resolvedPath).toString();
				const uri = vscode.Uri.parse(pathForUri);
				const startPos = new vscode.Position(instruction.token.line, instruction.token.startCharacter);
				const endPos = new vscode.Position(instruction.token.line, instruction.token.startCharacter + (instruction.token.length + 2));
				const link = new vscode.DocumentLink(new vscode.Range(startPos, endPos), uri);
				result.push(link);
			}
		});
		return result;
	}

}



