function actionGraficos(){
    var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
      keyboard: false,
      backdrop:false
    })
    myModal.show()
    setTimeout(()=>{
      divChart(myModal)
    },1000)

}
function divChart(myModal){
  
  console.log("Estou no DivChart")
    let data_ini = formatData($('#data_ini').val())
    let data_fin = formatData($('#data_fin').val())
    let dados=[];

    if(data_fin == "" || data_ini == ""){      
        dados = buscaDados();
    }else{
      dados = buscaDados(data_ini,data_fin)
    }
    let dashboard = `           
          <div style="overflow:hidden; max-width:90%; margin:0 auto;" class="mt-5">
              <div class="row d-flex align-items-center mb-2">
                <div class="col-12">
                  <div id="table">${criaTabela(dados)}</div>
                </div><!-- col-12 -->
              </div><!-- row -->
            
              <div class="row col mt-4">
                <div class="col-4">
                  <div class="card" style="d-flex justify-content-end align-items:center;">
                    <div class="card-body">
                      <div id="chartLine1"></div>
                    </div>
                  </div>
                </div> <!-- col-4 -->      
            
                <div class="col-8">
                  <div id="chart-wrap">
                    <div class="card">
                      <div class="card-body">
                        <div id="chart"></div>
                      </div>
                    </div>
                  </div>
                </div><!-- col-8-->
              </div> <!--row -->
            
              <div class="row col mt-4">
                <div class="col-3">
                  <div class="card">
                    <div class="card-body">
                      <div id="chartLine3"></div>
                    </div>
                  </div>
                </div>
                <div class="col-3">
                  <div class="card">
                    <div class="card-body">
                      <div id="chartLine4"></div>
                    </div>
                  </div>
                </div>
                            
                <div class="col-6">
                  <div class="card">
                    <div class="card-body">
                      <div id="chartBar"></div>
                    </div>
                  </div>
                </div><!-- col-4 -->
              </div>
            </div>

    `;


    let height = 300;

    let tela = $('#content')
    tela.empty();
    tela.append(dashboard)
    graficoBarraLinhaArea(dados,height)
    graficoBarras(dados,height)
    chartLine1(dados,height)
    chartLine3(dados,height)
    chartLine4(dados,height)
    console.log("fechando")
    stopLoading(myModal)

}

function formatData(data){
  let data_init = []

  if( data!=''){
    data_init = data.split("-");
    return `${data_init[2]}-${data_init[1]}-${data_init[0]}`
  }
}

function graficoBarraLinhaArea(dados,height){

    let descricaoPai = []
    let arrayPVF = []
    let arrayPVA = []

    dados.map((e)=> {
      if(e[1]==2){
        descricaoPai.push(e[2].substring(0,8))
        arrayPVF.push(parseFloat(e[4]).toFixed(2))
        arrayPVA.push(parseFloat(e[5]).toFixed(2))
      }
    })
    var options = {
        chart: {
          height:height,
          type: 'line',
          stacked: false,
        },
        stroke: {
          width: [0, 2, 5],
          curve: 'smooth'
        },
        plotOptions: {
          bar: {
            columnWidth: '50%'
          }
        },
        series: [{
          name: 'P.V.F',
          type: 'column',
          data: arrayPVA
        }, {
          name: 'P.V.A',
          type: 'area',
          data: arrayPVF
        }],
        fill: {
          opacity: [0.75,0.5,1],
                  gradient: {
                      inverseColors: false,
                      shade: 'dark',
                      type: "horizontal",
                      opacityFrom: 1,
                      opacityTo: 1,
                      stops: [0, 100, 100, 100]
                  }
        },
        labels: descricaoPai,
        markers: {
          size: 0
        },
        yaxis: {
          title: {
            text: 'P.V.F e P.V.A',
          },
          min: 0
        },
        legend: {
          show: false
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (y) {
              if(typeof y !== "undefined") {
                return  y.toFixed(2) + " reais";
              }
              return y;
              
            }
          }
        }
  
      }
  
      var chart = new ApexCharts(document.querySelector("#chart"), options);
  
      chart.render();
}

function graficoBarras(dados,height){
  let descricaoPai = []
  let lucro = []

  dados.map((e)=> {
    if(e[1]==2){
      descricaoPai.push(e[2].substring(0,8))
      lucro.push(((parseFloat(e[9]) - (parseFloat(e[10]) + parseFloat(e[12]))) / parseFloat(e[9])*100).toFixed(2))
    }
  })


    var options = {
        series: [{
        name: 'Lucro',
        data: lucro
      }],
        chart: {
        height:height,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'center', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        offsetY: 0,
        style: {
          fontSize: '11px',
          colors: ["#304758"]
        }
      },
      
      xaxis: {
        categories: descricaoPai,
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: false,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "%";
          }
        }
      
      },
      title: {
        text: 'Lucro',
        floating: true,
        offsetY: 0,
        align: 'top',
        style: {
          color: '#000'
        }
      }
      };

      var chart = new ApexCharts(document.querySelector("#chartBar"), options);
      chart.render();

}

function chartLine1(dados){
  let descricaoPai = []
  let vlrFinanceiro = []

  dados.map((e)=> {
    if(e[1]==2){
      descricaoPai.push(e[2].substring(0,7))
      vlrFinanceiro.push(e[8])

    }
  })

  var options = {
    series: [{
    name: 'Valor: ',
    data: vlrFinanceiro
  }],
    chart: {
    type: 'bar',
    height: 300
  },
  plotOptions: {
    bar: {
      colors: {
        ranges: [{
          from: -100,
          to: -46,
          color: '#F15B46'
        }, {
          from: -45,
          to: 0,
          color: '#FEB019'
        }]
      },
      columnWidth: '80%',
    }
  },
  dataLabels: {
    enabled: false,
  },
  yaxis: {
    title: {
      text: 'Valor financeiro',
    },
    labels: {
      formatter: function (y) {
        return "R$ "+ y.toFixed(2);
      }
    }
  },
  xaxis: {
    categories: descricaoPai,
    labels: {
      rotate: -75
    }
  }
  };

  var chart = new ApexCharts(document.querySelector("#chartLine1"), options);
  chart.render();

}


function chartLine3(dados,height){

  let descricaoPai = []
  let qtd = []

  dados.map((e)=> {
    if(e[1]==2){
      descricaoPai.push(e[2].substring(0,8))
      qtd.push(parseFloat(e[3]).toFixed(2))
    }
  })
    var options = {
        series: [{
          name: "Categoria",
          data: qtd
      }],
        chart: {
        height:height,
        type: 'area',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Quantidade produtos por categoria',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: descricaoPai,
      }
      };

      var chart = new ApexCharts(document.querySelector("#chartLine3"), options);
      chart.render();
    
}

function chartLine4(dados,height){

  let descricaoPai = []
  let cmv = []

  dados.map((e)=> {
    if(e[1]==2){
      descricaoPai.push(e[2].substring(0,8))
      cmv.push(parseFloat(e[12]).toFixed(2))
    }
  })
    var options = {
        series: [{
          name: "Categoria",
          data: cmv
      }],
        chart: {
        height:height,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'CMV',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: descricaoPai,
      }
      };

      var chart = new ApexCharts(document.querySelector("#chartLine4"), options);
      chart.render();
}

