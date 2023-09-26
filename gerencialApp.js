const hostname = location.hostname;
const port = location.port;
const user = getUserLogado();
var jnid = getJNID();

function getJNID(){

    let JSESSIONID = document.cookie.split('; ').find(row => row.startsWith('JSESSIONID=')).split('=')[1];
    JSESSIONID = JSESSIONID.split('.');
    JSESSIONID = JSESSIONID[0];
    return JSESSIONID;

}

// função para capturar codigo do usuario logado
function getUserLogado(){

    let userLogado = document.cookie.split('; ').find(row => row.startsWith('userIDLogado=')).split('=')[1];
    return userLogado;

}


function IniciarApp(){
    startApp()
}

function nomeUsu(user){
		let sql = `select NOMEUSU from TSIUSU u where u.CODUSU = ${user}`;
		let nome = getDadosSql(sql);

		return nome[0][0].replace('.', ' ');
}


// funçao de start do APP
function startApp(){
	// inicializando HTML #conteudo1
	initHtml();
	initModals();
    actionGraficos();
}


// inicializando conteudo1
function initHtml(){
	let conteudo1 = $('#pesquisa');
	conteudo1.empty();
	// let html = ` <div class="row">
	// 						<div class="col" id="barra">
	// 						</div>
	// 					</div>
	// 					<div class="row mt-2">
	// 					<div class="col-12">
	// 						<div class="card m-2">
	// 							<div class="card-body">
	// 								<div id="filtro">
	// 									<div class="row">
	// 										<div class="col-2>
	// 											<label class="form-label" for="dtini">Dt. Inicial</label>
	// 											<input type="date" class="form-control form-control-sm" name="dtini" id="dtini" value="">
	// 										</div>
	// 										<div class="col-2>
	// 											<label class="form-label" for="dtfim">Dt. Final</label>
	// 											<input type="date" class="form-control form-control-sm" name="dtfim" id="dtfim" value="">
	// 										</div>
	// 										<div class="col-1>
	// 										</div>
	// 									</div>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					</div>
	// 						<div class="col-12">
	// 							<div class="card m-2">
	// 								<div class="card-body">
	// 									<div id="dados">
	// 									</div>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					</div>`;
    let html = `
	<style>
	body{
	  background-color:#eee;
	}
	.mostraFilhas:hover{
	  cursor:pointer;
	}
	.loading_center {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  height: 90vh;
	  margin: 0;
	  background-color: #f0f0f0;
  }
	.loader {
	  border: 4px solid #f3f3f3;
	  border-top: 4px solid #3498db;
	  border-radius: 50%;
	  width: 50px;
	  height: 50px;
	  animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
	  0% { transform: rotate(0deg); }
	  100% { transform: rotate(360deg); }
  }
  </style>
	<nav class="navbar navbar-dark bg-dark">
		<div class="container-fluid justify-content-start">
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon" style="color:white;"></span>
			</button>
			<span style="color:white;font-size:2.2em;margin-left:20px" class="navbar-brand">Dashboard Gerencial</span>
		</div>
	</nav>
	<div class="collapse" id="navbarToggleExternalContent">
		<div class="bg-dark text-light p-4">
			<form>

				<div class="row">
					<div class="col">
						<div class="col-2 d-flex justify-content-between">
							<label class="form-label" for="data_ini">Data inicio:</label>
							<input type="date" style="padding:6px; border-radius:7px; border:none;" id="data_ini"/>
						</div>
					</div>
				</div>
				<div class="row mt-2">
					<div class="col">
						<div class="col-2 d-flex justify-content-between">
							<label class="form-label" for="data_ini">Data Final:</label>
							<input type="date" style="padding:6px; border-radius:7px; border:none;" id="data_fin"/>
						</div>
					</div>
				</div>
				<div class="col-2 mt-2">
					<button type="button" style="width:100%" onclick="actionGraficos();" class="btn btn-primary">Buscar</button>
				</div>

			</form>
		</div>
	</div>


    <div class="modal fade" id="myModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">Carregando...</h4>
                </div>

                <!-- Modal body com spinner Bootstrap -->
                <div class="modal-body text-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

  <div id="content"></div> `

	conteudo1.append(html);
}


function initModals(){
		// debugger;
	let conteudo2  = $('#exibe');
	let nivel5 = `<div class="modal fade text-left modal-warning" id="n5Modal">
										<div class="modal-dialog modal-dialog-centered modal-xl" role="document" >
											<div class="modal-content">
												<div class="modal-header" id="headerAlertModal">
													<div class="modal-topo">
														<h4 class="modal-title text-left float-left" id="tituloN5Modal">
														</h4>
													</div>
													<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
												</div>
												<div class="modal-body">
													<div id="dataN5Modal"></div>
												</div>
											</div>
										</div>
									</div>`;


	conteudo2.empty();
	conteudo2.append(nivel5);
}

function exibeN5(codprod){

	let sql = '';
	sql = `select p.CODPROD, p.COMPLDESC from TGFPRO p where p.CODPROD = ${codprod}`;
	produto = getDadosSql(sql);
	let titulo =  $('#tituloN5Modal');
	titulo.empty();
	titulo.append(produto[0][0]+' - '+produto[0][1]);

	sql = `                             select 	e.CODEMP,
											CONCAT(e.CODEMP, ' - ', e.NOMEFANTASIA)  as DESCRICAO,
											SUM(i.QTDNEG) AS QTD,
											SUM(i.VLRTOT) as PRECOFUTURO,
											SUM(i.PRECOBASE * i.QTDNEG) as PRECOAVISTA,
											SUM(i.VLRPROMO) as VLRPROMO,
											SUM(i.VLRICMS) as VLRICMS,
											SUM(
											CASE
												WHEN 	i.VLRUNIT = i.PRECOBASE THEN  0
												ELSE 	i.VLRTOT  - (i.PRECOBASE * i.QTDNEG)
											END) as VRLFINANCEIRO,
											SUM(
											CASE
												WHEN 	i.VLRUNIT < i.PRECOBASE THEN i.VLRTOT
												ELSE    i.PRECOBASE * i.QTDNEG
											END) AS VLRPRODUTO,
											SUM(
											CASE
												WHEN 	i.VLRUNIT < i.PRECOBASE THEN i.VLRTOT * ISNULL((fator.PISCOFINS + fator.COMISSAO + fator.ICMS + fator.IRCSLL + fator.MONTAGEM + fator.ENTREGA + fator.CUSTOFIXO + fator.OVERHEAD) / 100,0)
												ELSE    (i.PRECOBASE * i.QTDNEG) * ISNULL((fator.PISCOFINS + fator.COMISSAO + fator.ICMS + fator.IRCSLL + fator.MONTAGEM + fator.ENTREGA + fator.CUSTOFIXO + fator.OVERHEAD) / 100,0)
											END) AS VLRCUSTO_OP,
											AVG(proj.LUCRO ) as LUCROPROJ,
											SUM(i.CUSTO * i.QTDNEG) as CMV
											from TGFCAB c
											inner join TGFITE i on (i.NUNOTA 	= c.NUNOTA)
											inner join TGFPRO p on (p.CODPROD 	= i.CODPROD)
											inner join TGFVEN v on (v.CODVEND	= i.CODVEND)
											inner join TSIEMP e on (e.CODEMP	= c.CODEMP)
											inner join TGFGRU g1 on (g1.CODGRUPOPROD = p.CODGRUPOPROD)
											inner join TGFGRU g2 on (g2.CODGRUPOPROD = g1.CODGRUPAI)
											inner join TGFGRU g3 on (g3.CODGRUPOPROD = g2.CODGRUPAI)
											left  join TGFDIN pis on (pis.NUNOTA = i.NUNOTA and pis.SEQUENCIA = i.SEQUENCIA and pis.CODIMP = 6)
											left  join TGFDIN cofins on (cofins.NUNOTA = i.NUNOTA and cofins.SEQUENCIA = i.SEQUENCIA and cofins.CODIMP = 7)
											left  join AD_MARKUPREALIZADO fator on ( fator.CODGRUPOPROD  = g3.CODGRUPOPROD  AND  fator.MES = MONTH(DATEADD(MONTH, -1, c.DTNEG)) AND fator.ANO = YEAR(DATEADD(MONTH, -1, c.DTNEG)))
											left  join AD_MARKUP proj on (proj.CODGRUPOPROD3 = g3.CODGRUPOPROD)
											where c.CODTIPOPER 		= 1209
											and   c.STATUSNOTA 		= 'L'
											and   i.USOPROD 		= 'R'
											and   i.CODPROD 		= ${codprod}
											group by e.CODEMP, e.NOMEFANTASIA
											order by 3 desc `;
	let dadosTb         = getDadosSql(sql);
	let tela            = $('#dataN5Modal');
	tela.empty();
	let html            = '';
	let tabela          = '';
	let corNegativo     = '';
	let corLucro        = '';
	let corDesvio       = '';
	let format          = { minimumFractionDigits: 2 , style: 'currency', useGrouping: 'true', currency: 'BRL' };
	let pformat         = { minimumFractionDigits: 2 , style: 'percent', useGrouping: 'true', currency: 'BRL' };

	console.log('Dados: ', dadosTb);


	for(let i = 0; i < dadosTb.length; i++){
		let descricao = '';
		let cor       = '';
		let icone     = '';
		let exibe     = '';
		let pvf       = parseFloat(dadosTb[i][3]);
		let pva       = parseFloat(dadosTb[i][4]);
		let vlrf      = parseFloat(dadosTb[i][7]);
		let cmv       = parseFloat(dadosTb[i][11]);
		let cop       = parseFloat(dadosTb[i][9]);
		let lucro     = (parseFloat(dadosTb[i][8]) - (parseFloat(dadosTb[i][9]) + parseFloat(dadosTb[i][11]))) / parseFloat(dadosTb[i][8]);
		let plucro    = parseFloat(dadosTb[i][10]) / 100 ;
		let desvio    = lucro - plucro;


		let name  = dadosTb[i][0];

		descricao = dadosTb[i][1];

		if(vlrf < 0 ){
			corNegativo = 'color : red;';
		}else{
			corNegativo = '';
		}

		if(lucro < 0 ){
			corLucro = 'color : red;';
		}else{
			corLucro = '';
		}

		if(desvio < 0 ){
			corDesvio = 'color : red;';
		}else{
			corDesvio = 'color : green;';
		}

		tabela +=  `<tr grau="${dadosTb[i][1]}" name="${name}" style=" ${cor} font-weight: bold;">
								<td>${descricao}</td>
									<td style="text-align: right; ">${dadosTb[i][2]} </td>
									<td style="text-align: right; ">${pvf.toLocaleString("pt-BR", format)}</td>
									<td style="text-align: right; ">${pva.toLocaleString("pt-BR", format)}</td>
									<td style="text-align: right; ${corNegativo} ">${vlrf.toLocaleString("pt-BR", format)}</td>
									<td style="text-align: right; ">${cmv.toLocaleString("pt-BR", format)}</td>
									<td style="text-align: right; ">${cop.toLocaleString("pt-BR", format)}</td>
									<td style="text-align: right; ${corLucro} ">${lucro.toLocaleString("pt-BR", pformat)}</td>
									<td style="text-align: right; ">${plucro.toLocaleString("pt-BR", pformat)}</td>
									<td style="text-align: right; ${corDesvio} ">${desvio.toLocaleString("pt-BR", pformat)}</td>
								</tr>
								`;
	}


	html = `
				<div class="table-responsive-xxl" style="overflow-x:hidden; overflow-y:auto;  height: 300px;">
					<table class="table table-bordered table-hover" style="font-size: 12px;">
						<thead style="position: sticky; top: 0;">
							<tr class="bg-dark text-white">
								<th>DESCRIÇAO</th>
								<th>QTD</th>
								<th>P.V.F</th>
								<th>P.V.A</th>
								<th>V.F</th>
								<th>C.M.V</th>
								<th>C.O.P</th>
								<th>L.R</th>
								<th>L.P</th>
								<th>DESVIO</th>
							</tr>
						</thead>
						<tbody>
							${tabela}
						</tbody>
					</table>
				</div>
	`;

	tela.append(html);
	$('#n5Modal').modal('show');

}


function getDayFilters() {
	debugger;
}


function buscaDados(dataini,datafin){

	let data = new Date();
	let data_provi_fin = data.toLocaleDateString()
	let data_provi_ini = new Date(data.setDate(data.getDate()-1)).toLocaleDateString();

	if(dataini == undefined) {
		dataini = data_provi_ini
	}

	if(datafin == undefined) {
		datafin = data_provi_fin
	}

	let sql = ` select * from (
                    select 	g3.CODGRUPOPROD as CODGRUPO,
                            g3.GRAU as GRAU,
                            g3.DESCRGRUPOPROD  as DESCRICAO,
                            SUM(i.QTDNEG) AS QTD,
                            SUM(i.VLRTOT) as PRECOFUTURO,
                            SUM(i.PRECOBASE * i.QTDNEG) as PRECOAVISTA,
                            SUM(i.VLRPROMO) as VLRPROMO,
                            SUM(i.VLRICMS) as VLRICMS,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT = i.PRECOBASE THEN  0
                                ELSE 	i.VLRTOT  - (i.PRECOBASE * i.QTDNEG)
                            END) as VRLFINANCEIRO,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT < i.PRECOBASE THEN i.VLRTOT
                                ELSE    i.PRECOBASE * i.QTDNEG
                            END) AS VLRPRODUTO,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT < i.PRECOBASE THEN i.VLRTOT * ISNULL((fator.PISCOFINS + fator.COMISSAO + fator.ICMS + fator.IRCSLL + fator.MONTAGEM + fator.ENTREGA + fator.CUSTOFIXO + fator.OVERHEAD) / 100,0)
                                ELSE    (i.PRECOBASE * i.QTDNEG) * ISNULL((fator.PISCOFINS + fator.COMISSAO + fator.ICMS + fator.IRCSLL + fator.MONTAGEM + fator.ENTREGA + fator.CUSTOFIXO + fator.OVERHEAD) / 100,0)
                            END) AS VLRCUSTO_OP,
                                AVG(proj.LUCRO ) as LUCROPROJ,
                            SUM(i.CUSTO * i.QTDNEG) as CMV,
                            0 as CODPROD
                            from TGFCAB c
                            inner join TGFITE i on (i.NUNOTA 	= c.NUNOTA)
                            inner join TGFPRO p on (p.CODPROD 	= i.CODPROD)
                            inner join TGFVEN v on (v.CODVEND	= i.CODVEND)
                            inner join TGFGRU g1 on (g1.CODGRUPOPROD = p.CODGRUPOPROD)
                            inner join TGFGRU g2 on (g2.CODGRUPOPROD = g1.CODGRUPAI)
                            inner join TGFGRU g3 on (g3.CODGRUPOPROD = g2.CODGRUPAI)
                            left  join TGFDIN pis on (pis.NUNOTA = i.NUNOTA and pis.SEQUENCIA = i.SEQUENCIA and pis.CODIMP = 6)
                            left  join TGFDIN cofins on (cofins.NUNOTA = i.NUNOTA and cofins.SEQUENCIA = i.SEQUENCIA and cofins.CODIMP = 7)
                            left  join AD_MARKUPREALIZADO fator on ( fator.CODGRUPOPROD  = g3.CODGRUPOPROD  AND  fator.MES = MONTH(DATEADD(MONTH, -1, c.DTNEG)) AND fator.ANO = YEAR(DATEADD(MONTH, -1, c.DTNEG)))
                            left  join AD_MARKUP proj on (proj.CODGRUPOPROD3 = g3.CODGRUPOPROD)
                            where c.CODTIPOPER 		= 1209
                            and   c.STATUSNOTA 		= 'L'
                            and   i.USOPROD 		  = 'R'
                            and   cast(c.DTNEG as DATE) between '${dataini}' and '${datafin}'
                            group by g3.CODGRUPOPROD,g3.GRAU,g3.DESCRGRUPOPROD
                    union all
                    select 	g2.CODGRUPOPROD as CODGRUPO,
                            g2.GRAU as GRAU,
                            g2.DESCRGRUPOPROD  as DESCRICAO,
                            SUM(i.QTDNEG) AS QTD,
                            SUM(i.VLRTOT) as PRECOFUTURO,
                            SUM(i.PRECOBASE * i.QTDNEG) as PRECOAVISTA,
                            SUM(i.VLRPROMO) as VLRPROMO,
                            SUM(i.VLRICMS) as VLRICMS,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT = i.PRECOBASE THEN  0
                                ELSE 	i.VLRTOT  - (i.PRECOBASE * i.QTDNEG)
                            END) as VRLFINANCEIRO,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT < i.PRECOBASE THEN i.VLRTOT
                                ELSE    i.PRECOBASE * i.QTDNEG
                            END) AS VLRPRODUTO,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT < i.PRECOBASE THEN i.VLRTOT * ISNULL((fator.PISCOFINS + fator.COMISSAO + fator.ICMS + fator.IRCSLL + fator.MONTAGEM + fator.ENTREGA + fator.CUSTOFIXO + fator.OVERHEAD) / 100,0)
                                ELSE    (i.PRECOBASE * i.QTDNEG) * ISNULL((fator.PISCOFINS + fator.COMISSAO + fator.ICMS + fator.IRCSLL + fator.MONTAGEM + fator.ENTREGA + fator.CUSTOFIXO + fator.OVERHEAD) / 100,0)
                            END) AS VLRCUSTO_OP,
                                AVG(proj.LUCRO ) as LUCROPROJ,
                            SUM(i.CUSTO * i.QTDNEG) as CMV,
                                    0 as CODPROD
                            from TGFCAB c
                            inner join TGFITE i on (i.NUNOTA 	= c.NUNOTA)
                            inner join TGFPRO p on (p.CODPROD 	= i.CODPROD)
                            inner join TGFVEN v on (v.CODVEND	= i.CODVEND)
                            inner join TGFGRU g1 on (g1.CODGRUPOPROD = p.CODGRUPOPROD)
                            inner join TGFGRU g2 on (g2.CODGRUPOPROD = g1.CODGRUPAI)
                            inner join TGFGRU g3 on (g3.CODGRUPOPROD = g2.CODGRUPAI)
                            left  join TGFDIN pis on (pis.NUNOTA = i.NUNOTA and pis.SEQUENCIA = i.SEQUENCIA and pis.CODIMP = 6)
                            left  join TGFDIN cofins on (cofins.NUNOTA = i.NUNOTA and cofins.SEQUENCIA = i.SEQUENCIA and cofins.CODIMP = 7)
                            left  join AD_MARKUPREALIZADO fator on ( fator.CODGRUPOPROD  = g3.CODGRUPOPROD  AND  fator.MES = MONTH(DATEADD(MONTH, -1, c.DTNEG)) AND fator.ANO = YEAR(DATEADD(MONTH, -1, c.DTNEG)))
                            left  join AD_MARKUP proj on (proj.CODGRUPOPROD3 = g3.CODGRUPOPROD)
                            where c.CODTIPOPER 		= 1209
                            and   c.STATUSNOTA 		= 'L'
                            and   i.USOPROD 		= 'R'
                            and   cast(c.DTNEG as DATE) between '${dataini}' and '${datafin}'
                            -- and   c.NUNOTA = 648314 and i.SEQUENCIA = 1
                            group by g2.CODGRUPOPROD,g2.GRAU,g2.DESCRGRUPOPROD
                    union all
                    select 	g1.CODGRUPOPROD as CODGRUPO,
                            g1.GRAU as GRAU,
                            g1.DESCRGRUPOPROD  as DESCRICAO,
                            SUM(i.QTDNEG) AS QTD,
                            SUM(i.VLRTOT) as PRECOFUTURO,
                            SUM(i.PRECOBASE * i.QTDNEG) as PRECOAVISTA,
                            SUM(i.VLRPROMO) as VLRPROMO,
                            SUM(i.VLRICMS) as VLRICMS,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT = i.PRECOBASE THEN  0
                                ELSE 	i.VLRTOT  - (i.PRECOBASE * i.QTDNEG)
                            END) as VRLFINANCEIRO,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT < i.PRECOBASE THEN i.VLRTOT
                                ELSE    i.PRECOBASE * i.QTDNEG
                            END) AS VLRPRODUTO,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT < i.PRECOBASE THEN i.VLRTOT * ISNULL((fator.PISCOFINS + fator.COMISSAO + fator.ICMS + fator.IRCSLL + fator.MONTAGEM + fator.ENTREGA + fator.CUSTOFIXO + fator.OVERHEAD) / 100,0)
                                ELSE    (i.PRECOBASE * i.QTDNEG) * ISNULL((fator.PISCOFINS + fator.COMISSAO + fator.ICMS + fator.IRCSLL + fator.MONTAGEM + fator.ENTREGA + fator.CUSTOFIXO + fator.OVERHEAD) / 100,0)
                            END) AS VLRCUSTO_OP,
                                AVG(proj.LUCRO ) as LUCROPROJ,
                            SUM(i.CUSTO * i.QTDNEG) as CMV,
                            0 as CODPROD
                            from TGFCAB c
                            inner join TGFITE i on (i.NUNOTA 	= c.NUNOTA)
                            inner join TGFPRO p on (p.CODPROD 	= i.CODPROD)
                            inner join TGFVEN v on (v.CODVEND	= i.CODVEND)
                            inner join TGFGRU g1 on (g1.CODGRUPOPROD = p.CODGRUPOPROD)
                            inner join TGFGRU g2 on (g2.CODGRUPOPROD = g1.CODGRUPAI)
                            inner join TGFGRU g3 on (g3.CODGRUPOPROD = g2.CODGRUPAI)
                            left  join TGFDIN pis on (pis.NUNOTA = i.NUNOTA and pis.SEQUENCIA = i.SEQUENCIA and pis.CODIMP = 6)
                            left  join TGFDIN cofins on (cofins.NUNOTA = i.NUNOTA and cofins.SEQUENCIA = i.SEQUENCIA and cofins.CODIMP = 7)
                            left  join AD_MARKUPREALIZADO fator on ( fator.CODGRUPOPROD  = g3.CODGRUPOPROD  AND  fator.MES = MONTH(DATEADD(MONTH, -1, c.DTNEG)) AND fator.ANO = YEAR(DATEADD(MONTH, -1, c.DTNEG)))
                            left  join AD_MARKUP proj on (proj.CODGRUPOPROD3 = g3.CODGRUPOPROD)
                            where c.CODTIPOPER 		= 1209
                            and   c.STATUSNOTA 		= 'L'
                            and   i.USOPROD 		= 'R'
                            and   cast(c.DTNEG as DATE) between '${dataini}' and '${datafin}'
                            -- and   c.NUNOTA = 648314 and i.SEQUENCIA = 1
                            group by g1.CODGRUPOPROD, g1.GRAU, g1.DESCRGRUPOPROD
                    union all
                    select 	g1.CODGRUPOPROD as CODGRUPO,
                            5 as GRAU,
                            CONCAT(i.CODPROD,' - ',p.COMPLDESC) as DESCRICAO,
                            SUM(i.QTDNEG) AS QTD,
                            SUM(i.VLRTOT) as PRECOFUTURO,
                            SUM(i.PRECOBASE * i.QTDNEG) as PRECOAVISTA,
                            SUM(i.VLRPROMO) as VLRPROMO,
                            SUM(i.VLRICMS) as VLRICMS,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT = i.PRECOBASE THEN  0
                                ELSE 	i.VLRTOT  - (i.PRECOBASE * i.QTDNEG)
                            END) as VRLFINANCEIRO,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT < i.PRECOBASE THEN i.VLRTOT
                                ELSE    i.PRECOBASE * i.QTDNEG
                            END) AS VLRPRODUTO,
                            SUM(
                            CASE
                                WHEN 	i.VLRUNIT < i.PRECOBASE THEN i.VLRTOT * ISNULL((fator.PISCOFINS + fator.COMISSAO + fator.ICMS + fator.IRCSLL + fator.MONTAGEM + fator.ENTREGA + fator.CUSTOFIXO + fator.OVERHEAD) / 100,0)
                                ELSE    (i.PRECOBASE * i.QTDNEG) * ISNULL((fator.PISCOFINS + fator.COMISSAO + fator.ICMS + fator.IRCSLL + fator.MONTAGEM + fator.ENTREGA + fator.CUSTOFIXO + fator.OVERHEAD) / 100,0)
                            END) AS VLRCUSTO_OP,
                                AVG(proj.LUCRO ) as LUCROPROJ,
                            SUM(i.CUSTO * i.QTDNEG) as CMV,
                            i.CODPROD
                            from TGFCAB c
                            inner join TGFITE i on (i.NUNOTA 	= c.NUNOTA)
                            inner join TGFPRO p on (p.CODPROD 	= i.CODPROD)
                            inner join TGFVEN v on (v.CODVEND	= i.CODVEND)
                            inner join TGFGRU g1 on (g1.CODGRUPOPROD = p.CODGRUPOPROD)
                            inner join TGFGRU g2 on (g2.CODGRUPOPROD = g1.CODGRUPAI)
                            inner join TGFGRU g3 on (g3.CODGRUPOPROD = g2.CODGRUPAI)
                            left  join TGFDIN pis on (pis.NUNOTA = i.NUNOTA and pis.SEQUENCIA = i.SEQUENCIA and pis.CODIMP = 6)
                            left  join TGFDIN cofins on (cofins.NUNOTA = i.NUNOTA and cofins.SEQUENCIA = i.SEQUENCIA and cofins.CODIMP = 7)
                            left  join AD_MARKUPREALIZADO fator on ( fator.CODGRUPOPROD  = g3.CODGRUPOPROD  AND  fator.MES = MONTH(DATEADD(MONTH, -1, c.DTNEG)) AND fator.ANO = YEAR(DATEADD(MONTH, -1, c.DTNEG)))
                            left  join AD_MARKUP proj on (proj.CODGRUPOPROD3 = g3.CODGRUPOPROD)
                            where c.CODTIPOPER 		= 1209
                            and   c.STATUSNOTA 		= 'L'
                            and   i.USOPROD 		  = 'R'
                            and   cast(c.DTNEG as DATE) between '${dataini}' and '${datafin}'
                            -- and   c.NUNOTA = 648314 and i.SEQUENCIA = 1
                            group by g1.CODGRUPOPROD, i.CODPROD, p.COMPLDESC ) z
                            order by z.CODGRUPO, z.GRAU, z.QTD desc  `;


	let dadosTb       = getDadosSql(sql);
    return dadosTb
}

function criaTabela(dadosTb){
    
    let html          	= 	'';
	let tabela      	= 	'';
	let classTable		= 	'';
	let corNegativo   	= 	'';
	let corLucro      	= 	'';
	let iconLucro 		= 	'';
	let iconDesvio		= 	'';
	let iconVlrNegativo	=	'';
	let corDesvio     	= 	'';
	let linha         	=	0;
	let tqtd          	=	0;
	let tpvf          	=	0;
	let tpva          	= 	0;
	let tvlrf         	= 	0;
	let tcmv          	=	0;
	let tcop          	= 	0;
	let format        	= { minimumFractionDigits: 2 , style: 'currency', useGrouping: 'true', currency: 'BRL' };
	let pformat       	= { minimumFractionDigits: 2 , style: 'percent', useGrouping: 'true', currency: 'BRL' };
	let dformat       	= { minimumFractionDigits: 0 , style: 'decimal', useGrouping: 'true', currency: 'BRL' };

	for(let i = 0; i < dadosTb.length; i++){

		let descricao = '';

		let grau      = dadosTb[i][1];
		let cor       = '';
		let icone     = '';
		let exibe     = '';
		let qtd       = dadosTb[i][3];
		let pvf       = parseFloat(dadosTb[i][4]);
		let pva       = parseFloat(dadosTb[i][5]);
		let vlrf      = parseFloat(dadosTb[i][8]);
		let cmv       = parseFloat(dadosTb[i][12]);
		let cop       = parseFloat(dadosTb[i][10]);
		let lucro     = (parseFloat(dadosTb[i][9]) - (parseFloat(dadosTb[i][10]) + parseFloat(dadosTb[i][12]))) / parseFloat(dadosTb[i][9]);
		let plucro    = parseFloat(dadosTb[i][11]) / 100 ;
		let desvio    = lucro - plucro;
		let name      = '';
		let nameBt    = '';
		let action    = '';




		if(grau == 2){
			cor     = 'background-color: #fffff; color: #000; ';
			// console.log(dadosTb[i][2]+' : '+pvf.toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', useGrouping: 'true', currency: 'BRL' }));
			classTable = 'class="mostraFilhas"'
			name    = dadosTb[i][0].toString().substring(0,1);
			nameBt  = dadosTb[i][0].toString().substring(0,3);
			action  = `onclick="exibeRegistros(${nameBt});"`;
		}

		if(grau == 3){
			cor     = 'background-color: #999999; color: #ffffff; ';
			exibe   = 'display: none;';
			icone   = '<i class="bi bi-arrow-return-right"></i>';
			name    = dadosTb[i][0].toString().substring(0,3);
			nameBt  = dadosTb[i][0].toString().substring(0,5);
			classTable = 'class="mostraFilhas"'
			action  = `onclick="exibeRegistros(${nameBt});"`;
		}

		if(grau == 4){
			cor     = 'background-color: #e6e6e6; color: #000000; ';
			exibe   = 'display: none;';
			icone   = '<i class="bi bi-arrow-return-right"></i> <i class="bi bi-arrow-return-right"></i>';
			name    = dadosTb[i][0].toString().substring(0,5);
			nameBt  = dadosTb[i][0].toString();
			classTable = 'class="mostraFilhas"'
			action  = `onclick="exibeRegistros(${nameBt});"`;
		}

		if(grau == 5){
			exibe = 'display: none;';
			icone = '<i class="bi bi-arrow-return-right"></i> <i class="bi bi-arrow-return-right"></i> <i class="bi bi-arrow-return-right"></i>';
			name  = dadosTb[i][0];
			classTable = ''
			action  = `onclick="exibeN5(${dadosTb[i][13]});"`;
		}

		descricao = icone +' '+ dadosTb[i][2];


		if(vlrf < 0 ){
			corNegativo = 'class= "text-danger";';
			iconVlrNegativo = '<i class="bi bi-caret-down-fill"></i>'
		}else{
			corNegativo = '';
			iconVlrNegativo='';
		}

		if(lucro < 0 ){
			corLucro = 'class= "text-danger"';
			iconLucro = '<i class="bi bi-caret-down-fill"></i>'
		}else{
			iconLucro = 
			corLucro = '';
		}

		if(desvio < 0 ){
			corDesvio = 'class="text-danger"';
			iconDesvio = '<i class="bi bi-caret-down-fill"></i>'
		}else{
			iconDesvio = '<i class="bi bi-caret-up-fill"></i>'
			corDesvio = 'class="text-success"';
		}

		tabela +=  `<tr grau="${dadosTb[i][1]}" id="L${linha}" name="${name}" style="${exibe} ${cor} font-weight: bold;">
                        <td ${action} ${classTable}>${descricao}</td>
                        <td style="text-align:right; text-shadow: 0; ">${qtd.toLocaleString("pt-BR", dformat)}</td>
                        <td style="text-align:right;  text-shadow: 0; ">${pvf.toLocaleString("pt-BR", format)}</td>
                        <td style="text-align:right;  text-shadow: 0; ">${pva.toLocaleString("pt-BR", format)}</td>
                        <td style="text-align:right;  text-shadow: 0;" ${corNegativo}>${iconVlrNegativo} ${vlrf.toLocaleString("pt-BR", format)}</td>
                        <td style="text-align:right;  ">${cmv.toLocaleString("pt-BR", format)}</td>
                        <td style="text-align:right;  ">${cop.toLocaleString("pt-BR", format)}</td>
                        <th style="text-align:right;  text-shadow: 0;" ${corLucro}>${iconLucro} ${lucro.toLocaleString("pt-BR", pformat)}</th>
                        <th style="text-align:right;  ">${plucro.toLocaleString("pt-BR", pformat)}</th>
                        <th style="text-align:right;  text-shadow: 0;" ${corDesvio}>${iconDesvio} ${desvio.toLocaleString("pt-BR", pformat)}</th>
						<td style="text-align:right; text-shadow:0;">${calculoRentabilidade(cmv,pvf).toLocaleString("pt-BR",pformat)}</td>
                    </tr>
								`;
		linha++;
		if(dadosTb[i][1] == 2) {
			tqtd += parseFloat(dadosTb[i][3]);
			tpvf += pvf;
			tpva += pva;
			tvlrf += vlrf;
			tcmv += cmv;
			tcop += cop;
		}
	}

	if(tvlrf < 0 ){
		corNegativo = 'class= "text-danger";';
		iconVlrNegativo = '<i class="bi bi-caret-down-fill"></i>'
	}else{
		corNegativo = '';
	}

	total = `
					<tr class="table-info">
						<th style="text-align: left; ">TOTAL</th>
						<th style="text-align:right;">${tqtd.toLocaleString("pt-BR", dformat)}</th>
						<th style="text-align:right;">${tpvf.toLocaleString("pt-BR", format)}</th>
						<th style="text-align:right;">${tpva.toLocaleString("pt-BR", format)}</th>
						<th style="text-align:right;" ${corNegativo}>${tvlrf.toLocaleString("pt-BR", format)}</th>
						<th style="text-align:right;">${tcmv.toLocaleString("pt-BR", format)}</th>
						<th style="text-align:right;">${tcop.toLocaleString("pt-BR", format)}</th>
						<th style="text-align:right;">0</th>
						<th style="text-align:right;">0</th>
						<th style="text-align:right;">0</th>
						<th style="text-align:right;">${calculoRentabilidade(tcmv, tpvf).toLocaleString("pt-BR",format)}</th>
					</tr>
					`;


	html = `
		<div class="row justify-content-center">
			<div class="col-12">
				<div class="card" style="border-radius:.5em;border:none;">
					<div class="card-body">
						<div class="table-responsive">
							<table class="table table-hover mb-0" style="font-size:12px">
								<thead style="position: sticky; top: 0;">
									<tr>
										<th style="text-align:left" scope="col">DESCRICAO</th>
										<th style="text-align:right" scope="col">QTD</th>
										<th style="text-align:right" scope="col">P.V.F</th>
										<th style="text-align:right" scope="col">P.V.A</th>
										<th style="text-align:right" scope="col">V.F</th>
										<th style="text-align:right" scope="col">C.M.V</th>
										<th style="text-align:right" scope="col">C.O.P</th>
										<th style="text-align:right" scope="col">L.R</th>
										<th style="text-align:right" scope="col">L.P</th>
										<th style="text-align:right" scope="col">DESVIO</th>
										<th style="text-align:right" scope="col">C.R</th>
									</tr>
									${total}
								</thead>
								<tbody>
									${tabela}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;

	return html;

}

function calculoRentabilidade(custo,venda){
	let pri = custo * 0.8895
	let seg = pri/venda
	let ter = seg + 0.1105
	let qua = 1 - ter
	let qui = qua * 100;
	console.log(pri)
	console.log(seg)
	console.log(ter)
	console.log(qua)
	console.log(qui)

	return (((custo * 0.8895 / venda) + 0.1105) -1 ) * 100
}

function exibeRegistros(name){
		let objetos = $("tr[name="+name+"]");
		for(let i = 0; i < objetos.length; i++){
			console.log('Id:'+objetos[i].id,objetos[i], 'Name: '+$('#'+objetos[i].id).attr('name'));
			if($('#'+objetos[i].id).css('display') == 'none' ){
				$('#'+objetos[i].id).show("slide");
			}else{
				$('#'+objetos[i].id).hide("slide");
				escondeFilhos($('#'+objetos[i].id).attr('name'));
			}
		}

}

function escondeFilhos(name){
	let filhos = $("tr[name^="+name+"]").filter("[name!="+name+"]");
	for(let ii = 0; ii < filhos.length; ii++){
		if($('#'+filhos[ii].id).css('display') != 'none' ){
			$('#'+filhos[ii].id).hide();
		}
	}
}