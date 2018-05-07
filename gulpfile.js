//Carrega informações do projeto
var projeto = require('./projeto.json');
var pkg = require('./package.json');
var gulp = require('gulp');
var fs = require('fs');
var watch, compass, bowerMain, uglify, browserSync, prompt, reload, os, open, navegador, ambiente;

/*Verifica o sistema operacional para definir o caminho de rede e usuários para definir log atualizado */
var os = process.platform,
usuario = '',
caminhoRede = '';
if (os == 'darwin') {
	console.log('Parabéns, você está usando Mac OS X.');
	usuario = process.env.USER;
	caminhoRede = '/Volumes/Homologacao/';
	comandoTerminal = 'npm';
} else if (os == 'win32') {
	console.log('Que pena, você está usando Windows!');
	usuario = process.env.USERNAME;
	caminhoRede = '\\\\bhsrvapp01\\Homologacao\\';
	comandoTerminal = 'npm.cmd';
} else if (os == 'linux') {
	console.log('Ta bom, já que você é louco de usar Linux a gente deixa...');
	usuario = process.env.USER;
}

/*swallowError */
function swallowError (error) {
	console.log(error.toString());
	this.emit('end');
}

/*Verifica e instala dependências */
gulp.task('verifica', function() {
	var devDependencies = pkg.devDependencies;
	var listaDependencias = Object.keys(devDependencies);
	var installCmd = '';
	var pacotesAusentes = [];

	fs.readdir('node_modules/', function (err, subDirs) {
		var subDiretorios = [];
		for (var i = subDirs.length - 1; i >= 0; i--) {
			var subDiretorio = subDirs[i];
			if (subDiretorio.indexOf('.') !== 0) {
				subDiretorios.push(subDiretorio);
			}
		}
		var devDependencies = pkg.devDependencies;
		var listaDependencias = Object.getOwnPropertyNames(devDependencies);
		if (subDiretorios.length -1 !== listaDependencias.length) {
			console.log('Modulos NPM não encontrados, iniciando a instalação (Isso vai demorar, tenha calma)...');

			/*Valida modulos presentes e cria lista para instalação */
			for (var j = listaDependencias.length - 1; j >= 0; j--) {
				var modulo = listaDependencias[j];
				if (!fs.existsSync('node_modules/' + modulo)) {
					pacotesAusentes.push(modulo);
				}
			}

			/*Inicia instalação de pacotes ausentes */
			for (var k = 0; k <= pacotesAusentes.length - 1; k++) {
				if (k < pacotesAusentes.length - 1) {
					installCmd += comandoTerminal + ' install --save-dev ' + pacotesAusentes[k] + ' && ';
				} else {
					installCmd += comandoTerminal + ' install --save-dev ' + pacotesAusentes[k];
				}
			}

			run_cmd(installCmd, function() {
				watch = require('gulp-watch');
				compass = require('gulp-compass');
				bowerMain = require('bower-main');
				uglify = require('gulp-uglifyjs');
				browserSync = require('browser-sync');
				prompt = require('gulp-prompt');
				os = require('os');
				open = require('gulp-open');
				reload = browserSync.reload;
				console.log('Instalação concluída, continuando...');
				console.log(projeto.author.email);
				if (projeto.author.email === "") {
					gulp.start('setup');
				} else {
					gulp.start('start');
				}
			});
		} else if (projeto.author.email === "") {
			watch = require('gulp-watch');
			compass = require('gulp-compass');
			bowerMain = require('bower-main');
			uglify = require('gulp-uglifyjs');
			browserSync = require('browser-sync');
			prompt = require('gulp-prompt');
			os = require('os');
			open = require('gulp-open');
			reload = browserSync.reload;
			gulp.start('setup');
		} else {
			watch = require('gulp-watch');
			compass = require('gulp-compass');
			bowerMain = require('bower-main');
			uglify = require('gulp-uglifyjs');
			browserSync = require('browser-sync');
			prompt = require('gulp-prompt');
			os = require('os');
			open = require('gulp-open');
			reload = browserSync.reload;
			gulp.start(['start']);
		}
	});

	function run_cmd(cmd, callBack ) {
		var exec = require('child_process').exec;
		exec(cmd, callBack);
	}

});

/*Compass */
gulp.task('compass', function() {
	gulp.src(projeto.sass_dir + '/*.scss')
	.pipe(compass({
		css: projeto.css_dir,
		generated_images_path: projeto.images_dir,
		http_path: projeto.http_path,
		image: projeto.sprite_load_path,
		sass: projeto.sass_dir,
		style: 'compressed',
		sourcemap: true,
		relative: true
	}))
	.on('error', swallowError);
});

/*Minifica os arquivos para copia (Busca tudo instalado via bower)*/
gulp.task('bower', function() {
	var bowerMainJavaScriptFiles = bowerMain('js','min.js');
	gulp.src(bowerMainJavaScriptFiles.normal)
	.pipe(uglify('external.min.js',{
		outSourceMap: true
	}))
	.on('error', swallowError)
	.pipe(gulp.dest(projeto.dist_dir + '/js'));
});

gulp.task('minify', function() {
	gulp.src([projeto.assets_dir + '/Repositorio/js/geral.js'])
	.pipe(uglify('main.min.js',{
		outSourceMap: true
	}))
	.on('error', swallowError)
	.pipe(gulp.dest(projeto.dist_dir + '/js'));
});

/*Minifica as imagens*/
gulp.task('imagemin', function () {
	var imageminGifsicle = require('imagemin-gifsicle');
	var imageminJpegtran = require('imagemin-jpegtran');
	var imageminOptipng = require('imagemin-optipng');

	gulp.src(projeto.assets_dir + '/Repositorio/img/**/*.gif')
	.pipe(imageminGifsicle({interlaced: true})())
	.pipe(gulp.dest(projeto.local_dir + '/Repositorio/dist/img'));

	gulp.src(projeto.assets_dir + '/Repositorio/img/**/*.jpg')
	.pipe(imageminJpegtran({progressive: true})())
	.pipe(gulp.dest(projeto.local_dir + '/Repositorio/dist/img'));

	gulp.src(projeto.assets_dir + '/Repositorio/img/**/*.png')
	.pipe(imageminOptipng({optimizationLevel: 3})())
	.pipe(gulp.dest(projeto.local_dir + '/Repositorio/dist/img'));
});

/*Sincroniza os arquivos da pasta dist para a pasta de homologação*/
var assets = projeto.assets_dir,
local = projeto.local_dir,
fontsAssets = projeto.fonts_assets,
dest = caminhoRede + projeto.homologacao_dir,
fontsDist = projeto.fonts_dir;
gulp.task('sync', function() {
	gulp.src(assets + '**/*.html', {base: assets})
	.pipe(watch(assets + '**/*.html', {base: assets}))
	.pipe(gulp.dest(local));

	gulp.src(assets + '**/*.aspx', {base: assets})
	.pipe(watch(assets + '**/*.aspx', {base: assets}))
	.pipe(gulp.dest(local));

	gulp.src(assets + '**/*.ascx', {base: assets})
	.pipe(watch(assets + '**/*.ascx', {base: assets}))
	.pipe(gulp.dest(local));

	if (ambiente != 'Local') {
		gulp.src(local + '/**/*', {base: local})
		.pipe(watch(local + '/**/*', {base: local}))
		.pipe(gulp.dest(dest));
	}

	gulp.src(fontsAssets + '/**/*.*', {base: fontsAssets})
	.pipe(watch(fontsAssets + '/**/*', {base: fontsAssets}))
	.pipe(gulp.dest(fontsDist));
}, reload);

/*Browser sync*/
gulp.task('browser-sync', function() {
	browserSync({
		browser: navegador,
		port: 9000,
		server: {
			baseDir: ambiente
		}
	});
});

//Open url
gulp.task('open', function(){
	if (projeto.homologacao_url.indexOf('http') != -1) {
		var options = {
			uri: projeto.homologacao_url,
			app: navegador
		};
	} else {
		var options = {
			uri: 'http://' + projeto.homologacao_url,
			app: navegador
		};
	}
	gulp.src(__filename)
	.pipe(open(options));
});

//Instalação de projeto
gulp.task('setup', function() {
	console.log('Iniciando a instalação do projeto');
	gulp.src('*')
	.pipe(prompt.prompt([
	{
		type: 'input',
		name: 'nomeProjeto',
		message: 'Qual o nome do projeto?',
		validate: function(nomeProjeto){
			if(nomeProjeto.length < 1){
				return false;
			}
			return true;
		}
	},
	{
		type: 'input',
		name: 'descricaoProjeto',
		message: 'Digite a descrição do projeto',
		validate: function(descricaoProjeto){
			if(descricaoProjeto.length < 1){
				return false;
			}
			return true;
		}
	},
	{
		type: 'input',
		name: 'pastaHomologacao',
		message: 'Digite a pasta em Homologação (Caminho a partir de Homologacao/ até a pasta Repositorio)',
		validate: function(pastaHomologacao){
			if(pastaHomologacao.length < 1){
				return false;
			}
			return true;
		}
	},
	{
		type: 'input',
		name: 'urlHomologacao',
		message: 'Digite o endereço do site em Homologação',
		validate: function(urlHomologacao){
			if(urlHomologacao.length < 1){
				return false;
			}
			return true;
		}
	},
	{
		type: 'input',
		name: 'autor',
		message: 'Digite seu nome',
		validate: function(autor){
			if(autor.length < 1){
				return false;
			}
			return true;
		}
	},
	{
		type: 'input',
		name: 'emailAutor',
		message: 'Digite seu email ',
		validate: function(emailAutor){
			if(emailAutor.length < 1){
				return false;
			}
			return true;
		}
	}], function(res) {
		projeto.title = res.nomeProjeto;
		projeto.description = res.descricaoProjeto;
		projeto.homologacao_dir = res.pastaHomologacao;
		projeto.homologacao_url = res.urlHomologacao;
		projeto.author.name = res.autor;
		projeto.author.email = res.emailAutor;
		fs.writeFileSync('projeto.json', JSON.stringify(projeto, null, "\t"));
		gulp.start('start');
	}
	));
});

//Cria tarefa de start do projeto
gulp.task('start', function() {
	gulp.src('*')
	.pipe(prompt.prompt([{
		type: 'checkbox',
		name: 'navegador',
		message: 'Qual navegador deseja usar?',
		choices: ['Firefox', 'Google Chrome'],
		default: 'Google Chrome'
	}, {
		type: 'checkbox',
		name: 'ambiente',
		message: 'Qual ambiente deseja usar?',
		choices: ['Homologação', 'Local'],
		default: 'Homologação'
	}], function(res){
		/*Verificar o navegador escolhido*/
		if (res.navegador == 'Firefox') {
			navegador = 'firefox';
		} else if (res.navegador == 'Google Chrome') {
			navegador = 'google chrome';
		}

		/*Verifica o ambiente escolhido*/
		if (res.ambiente == 'Homologação') {
			ambiente = caminhoRede + projeto.homologacao_dir;
			/*Chama as tarefas do projeto*/
			gulp.start(['compass', 'bower','minify', 'sync', 'open']);
		} else if (res.ambiente == 'Local') {
			ambiente = projeto.local_dir;
			/*Chama as tarefas do projeto*/
			gulp.start(['compass', 'bower','minify', 'sync', 'browser-sync']);
		}
		
		/*Monitora arquivos alterados e delega as devidas tarefas*/
		gulp.watch(projeto.javascripts_dir + '/**/*.js', ['minify']);
		gulp.watch('bower.json', ['bower']);
		gulp.watch(projeto.sass_dir + '/*.scss', ['compass']);
		fs.watch(projeto.assets_dir + '/Repositorio/img', function (event, filename) {
			gulp.start('imagemin');
		});
		gulp.watch(projeto.sprite_load_path + '/**/*.png', ['compass']);

		if (res.ambiente == 'Homologação') {
			gulp.watch([ambiente + '/**/*.{html,aspx,ascx,js,css,jpg,jpeg,png,gif}', '!' + ambiente + '/Repositorio/dist/sprite/**/*']);
		} else if (res.ambiente == 'Local') {
			gulp.watch([ambiente + '/**/*.{html,aspx,ascx,js,css,jpg,jpeg,png,gif}', '!' + ambiente + '/Repositorio/dist/sprite/**/*']).on('change', reload);
		}
		
		//console.log('!' + ambiente + '/dist/sprite/**/*');
	}));
});

/*Cria tarefa padrão*/
gulp.task('default', ['verifica']);