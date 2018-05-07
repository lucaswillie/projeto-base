Start Project
======

Versão: 1.0.1

---

Arquivos
---

Dependências
-----

`package.json`

Gulp Tasks
-----

`gulpfile.js`

Informações do projeto
-----

`projeto.json`

Pasta de Desenvolvimento
-----

`assets`

Pasta Produção
-----

`Caminho a ser definido na configuração do projeto`

Pasta de Teste local
-----

`Local`

---

Instalando o Gulp e as dependências no projeto
---

* 1 - Verificar se já está instalado na máquina o Node.js, Gulp, Ruby, Compass, Git, etc.
* 2 - Entrar na raiz do projeto pela linha de comando (CMD ou Terminal em modo administrador).
* 3 - Clonar o projeto com o comando
	* Mac OS X / Linux
	`git clone nome do repositorio . && rm -rf .git`
	* Windows
	`git clone nome do repositorio . && rmdir /S /Q .git`
* 4 - Dê o comando -- 'gulp' no CMD ou Terminal (Serão instaladas as dependências e solicitada a configuração do projeto.
* 5 - Bom trabalho!

---

Comando Utilizado
---

`gulp` Instala, configura e executa o projeto

---

Trabalhando com BOOTSTRAP/SASS
----

SASS - Os arquivos sass estão localizados no pasta `assets/Repositorio/sass`

* 1 - Arquivo principal de importação `estilo.scss`
* 2 - Arquivo de mixins (animações, bordas, sombras) para uso geral `_mixin.scss`
* 3 - Arquivo de inclusão de classes e css em geral do projeto `_main.scss`

BOOTSTRAP - Os arquivos bootstrap estão localizados no pasta `assets/Repositorio/sass/bootstrap`

* A importação dos módulos estão configuradas no arquivo estilo.scss, devendo ser retirado o comentário para fazer a importação no projeto.

Obs.: O `estilo.css` será gerado na pasta de produçãoArquivos a serem inseridos como importação deverão começar com `_` para que não sejam compilados de forma isolada

---

Trabalhando com JavaScript
---

Atualizar JavaScript:
-----

* Arquivo para funções, classes e js em geral `assets/js/geral.js`

Inserir uma biblioteca Js:
-----

* 1 - Entrar na raiz do projeto pelo CMD ou Terminal.
* 2 - Instalar a dependência via Bower `bower install --save-dev [nome-da-dependencia]`

---

Imagens
---

* 1 - Colocar as imagens em geral na pasta `assets/img`
* 2 - Colocar as imagens a serem geradas em sprite em `assets/sprite`
	
Obs.:As imagens serão geradas na pasta de produção