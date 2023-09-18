import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  selectedFiles: File[] = [];
  modifiedFiles: File[] = [];
  uploading: boolean = false;

  // BackEnd Config
  private host = 'localhost';
  private port = '8082';
  private apiRoute = '';

  @ViewChild('fileUploadForm')
  fileUploadForm: ElementRef<HTMLFormElement> | null = null;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  // Função genérica para exibir mensagens em um Snackbar
  popupMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      verticalPosition: 'top',
    });
  }

  // Ao selecionar um ou multiplos arquivos, processa cada um deles para remover dados confidenciais.
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = [];
    this.modifiedFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file: File | null = files.item(i);
      if (file) {
        this.selectedFiles.push(file);
        this.processXmlFile(file);
      }
    }
  }

  // Processa os arquivos
  processXmlFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const xmlString = reader.result as string;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      // Remove os dados confidenciais do arquivo.
      const modifiedFile = this.replaceConfidentialData(xmlDoc, file.name);

      // Adiciona o arquivo modificado a lista de arquivos modificados
      this.modifiedFiles.push(modifiedFile);
    };
    reader.readAsText(file);
  }

  // Função que modifica todos os dados confidenciais de 'precoMedio' e define eles para ''.
  replaceConfidentialData(xmlDoc: Document, originalFileName: string): File {
    const precoMedioElements: Element[] = Array.from(
      xmlDoc.querySelectorAll('precoMedio')
    );
    for (const element of precoMedioElements) {
      element.textContent = '';
    }

    // Criando um novo arquivo XML modificado
    const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);
    const modifiedFile = new File([modifiedXmlString], originalFileName, {
      type: 'text/xml',
    });

    return modifiedFile;
  }

  // Envia o arquivo ao BackEnd
  async uploadFile() {
    // Definindo uploading como true enquanto envia o arquivo para rodar o loader
    this.uploading = true;

    // Verificando se existem arquivos a serem enviados
    if (this.selectedFiles.length === 0) {
      this.popupMessage('Nenhum arquivo selecionado');
      this.uploading = false;
      return;
    }

    const formData = new FormData();
    this.modifiedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const url = `http://${this.host}:${this.port}/${this.apiRoute}`;
      const response: HttpResponse<any> | undefined = await this.http
        .post(url, formData, {
          observe: 'response',
        })
        .toPromise();
      // Caso não receba resposta
      if (!response) {
        this.popupMessage('Erro na conexão com o servidor');
        return;
      }
      // Caso a resposta tenha sido um sucesso, remove os arquivos selecionados.
      if (response.status === 200) {
        this.selectedFiles = [];
        this.modifiedFiles = [];
        // Reseta o formulario de seleção de arquivos
        if (this.fileUploadForm) {
          this.fileUploadForm.nativeElement.reset();
        }
      }
      const message = response.body.message as string;
      this.popupMessage(message);
    } catch (error) {
      this.popupMessage(`Erro na conexão com o servidor`);
    } finally {
      // Remove o loader
      this.uploading = false;
    }
  }
}
