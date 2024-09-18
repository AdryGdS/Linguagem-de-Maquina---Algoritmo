// Função para calcular a regressão linear
function regressaoLinear(x, y) {
    const n = x.length;
    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;
    
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (x[i] - xMean) * (y[i] - yMean);
      den += (x[i] - xMean) ** 2;
    }
    
    const m = num / den;
    const b = yMean - m * xMean;
    
    return { m, b };
  }
  
  // Função para calcular o coeficiente de determinação (R²)
  function calcularR2(x, y, m, b) {
    const yMean = y.reduce((a, b) => a + b, 0) / y.length;
    
    let ssTot = 0, ssRes = 0;
    for (let i = 0; i < x.length; i++) {
      const yPred = m * x[i] + b;
      ssTot += (y[i] - yMean) ** 2;
      ssRes += (y[i] - yPred) ** 2;
    }
    
    return 1 - (ssRes / ssTot);
  }
  
  // Função para processar o CSV
  function processCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
  
    if (!file) {
      alert('Por favor, selecione um arquivo CSV!');
      return;
    }
  
    Papa.parse(file, {
      complete: function(results) {
        const data = results.data;
        const output = [];
  
        // Função para converter valores para números e remover não numéricos
        function cleanData(dataArray) {
          return dataArray.map(val => {
            const num = parseFloat(val);
            return isNaN(num) ? null : num;
          }).filter(val => val !== null);
        }
  
        // Limpar e converter os dados de cada amostra
        const amostra1_x = cleanData(data.map(row => row[0]));
        const amostra1_y = cleanData(data.map(row => row[1]));
        const amostra2_x = cleanData(data.map(row => row[2]));
        const amostra2_y = cleanData(data.map(row => row[3]));
        const amostra3_x = cleanData(data.map(row => row[4]));
        const amostra3_y = cleanData(data.map(row => row[5]));
        const amostra4_x = cleanData(data.map(row => row[6]));
        const amostra4_y = cleanData(data.map(row => row[7]));
  
        // Verificar se os dados foram processados corretamente
        if ([amostra1_x, amostra1_y, amostra2_x, amostra2_y, amostra3_x, amostra3_y, amostra4_x, amostra4_y].some(arr => arr.length === 0)) {
          alert('O arquivo CSV contém dados inválidos ou não numéricos.');
          return;
        }
  
        const amostras = [
          { x: amostra1_x, y: amostra1_y, nome: 'Amostra1' },
          { x: amostra2_x, y: amostra2_y, nome: 'Amostra2' },
          { x: amostra3_x, y: amostra3_y, nome: 'Amostra3' },
          { x: amostra4_x, y: amostra4_y, nome: 'Amostra4' }
        ];
  
        let somaR2 = 0;
        const tabelaResultados = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
  
        // Limpar a tabela antes de adicionar novos resultados
        tabelaResultados.innerHTML = '';
  
        amostras.forEach((amostra, index) => {
          const { m, b } = regressaoLinear(amostra.x, amostra.y);
          const r2 = calcularR2(amostra.x, amostra.y, m, b);
          somaR2 += r2;
  
          // Adicionar linha à tabela
          const row = tabelaResultados.insertRow();
          row.insertCell(0).textContent = amostra.nome;
          row.insertCell(1).textContent = m.toFixed(4);
          row.insertCell(2).textContent = b.toFixed(4);
          row.insertCell(3).textContent = r2.toFixed(4);
  
          output.push(`${amostra.nome} -> m: ${m.toFixed(4)}, b: ${b.toFixed(4)}, R²: ${r2.toFixed(4)}`);
        });
  
        const mediaR2 = somaR2 / amostras.length;
        output.push(`Média de R²: ${mediaR2.toFixed(4)}`);
        
        // Exibir média na tabela
        const row = tabelaResultados.insertRow();
        row.insertCell(0).textContent = 'Média de R²';
        row.insertCell(1).textContent = '-';
        row.insertCell(2).textContent = '-';
        row.insertCell(3).textContent = mediaR2.toFixed(4);
  
        document.getElementById('output').textContent = output.join('\n');
      }
    });
  }
  
  // Função para salvar os resultados como CSV
  function salvarResultados() {
    const tabela = document.getElementById('resultsTable');
    let csv = [];
    
    for (let i = 0; i < tabela.rows.length; i++) {
      let row = [];
      for (let j = 0; j < tabela.rows[i].cells.length; j++) {
        row.push(tabela.rows[i].cells[j].textContent);
      }
      csv.push(row.join(','));
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "resultados_regressao.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  