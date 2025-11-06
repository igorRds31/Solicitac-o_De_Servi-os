// --- 1. DADOS (Nosso "Banco de Dados" de Serviços) ---
const servicos = [
    { id: 1, nome: "Psicologo", descricao: "Avaliação, diagnóstico e tratamento de transtornos emocionais, psicológicos e comportamentais, utilizando técnicas terapêuticas variadas", imagem: "../img/Psicologa.jpeg" },
    { id: 2, nome: "Oftalmologista", descricao: "Saúde dos olhos, que diagnostica e trata doenças oculares, além de prescrever óculos, lentes de contato e realizar cirurgias", imagem: "../img/Oftalmo.jpeg" },
    { id: 3, nome: "Dentista", descricao: "Cuida da saúde e estética da boca, dentes, gengivas, língua e ossos da face", imagem: "../img/Dentista.jpeg" },
    { id: 4, nome: "Clinico Geral", descricao: "Atende casos diversos, solicita exames e faz encaminhamentos para especialistas.", imagem: "../img/Clinico_Geral.jpeg" },
    { id: 5, nome: "Gastroenterologia", descricao: "Trata doenças do sistema digestivo, como estômago e intestino.", imagem: "../img/Gastroenterologia.jpeg" },
    { id: 6, nome: "Dermatologia", descricao: "Trata doenças e problemas de pele, unhas e cabelos, além de realizar procedimentos estéticos.", imagem: "../img/Demartoligista.jpeg" }
];

// Espera o DOM (a página) carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- 2. REFERÊNCIAS DO DOM ---
    const servicosListaContainer = document.getElementById('servicos-lista');
    const servicoSelect = document.getElementById('servico-select');
    const agendamentoForm = document.getElementById('agendamento-form');
    const solicitacoesListaContainer = document.getElementById('solicitacoes-lista');

    // --- 3. FUNÇÕES ---
    function renderizarServicos() {
        if (!servicosListaContainer) return;

        servicosListaContainer.innerHTML = '';
        if (servicoSelect) servicoSelect.innerHTML = '<option value="">Selecione...</option>';

        servicos.forEach(servico => {
            const card = document.createElement('div');
            card.className = 'servico-card';

            card.innerHTML = `
                <img src="${servico.imagem}" alt="Ilustração do serviço ${servico.nome}" class="servico-imagem">
                <h3>${servico.nome}</h3>
                <p>${servico.descricao}</p>
            `;

            servicosListaContainer.appendChild(card);

            // Adiciona opção no select se ele existir
            if (servicoSelect) {
                const option = document.createElement('option');
                option.value = servico.nome;
                option.textContent = servico.nome;
                servicoSelect.appendChild(option);
            }
        });
    }

    // --- FUNÇÃO ATUALIZADA: compara data e horário local ---
    function dataPassou(dataString, horarioString) {
        const agora = new Date();
        const dataHoraString = `${dataString}T${horarioString}`;
        const dataHoraInformada = new Date(dataHoraString);
        return dataHoraInformada < agora;
    }

    function deletarSolicitacao(indice) {
        Swal.fire({
            title: "Você tem certeza?",
            text: "Deseja excluir sua solicitação?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Não, cancelar!",
            confirmButtonColor: '#d33',
            cancelButtonColor: '#28a745',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
                solicitacoes.splice(indice, 1);
                localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
                renderizarSolicitacoes();

                Swal.fire({
                    title: "Deletado!",
                    text: "Solicitação deletada com sucesso!",
                    icon: "success",
                    confirmButtonColor: '#28a745'
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelado",
                    text: "Sua solicitação ainda está salva :)",
                    icon: "error",
                    confirmButtonColor: '#28a745'
                });
            }
        });
    }

    function redirecionarParaEdicao(indice) {
        localStorage.setItem('indiceEdicao', indice);
        window.location.href = 'editar.html';
    }

    function renderizarSolicitacoes() {
        if (!solicitacoesListaContainer) return;

        const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
        solicitacoesListaContainer.innerHTML = '';

        if (solicitacoes.length === 0) {
            solicitacoesListaContainer.innerHTML = '<p>Nenhuma solicitação encontrada.</p>';
            return;
        }

        solicitacoes.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'solicitacao-item';
            const dataFormatada = new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR');
            const dataExpirada = dataPassou(item.data, item.horario); // <-- usa data e horário agora
            if (dataExpirada) itemDiv.classList.add('expirada');

            itemDiv.innerHTML = `
                ${dataExpirada ? '<div class="status-expirada">EXPIRADA</div>' : ''}
                <h4>${item.servico}</h4>
                <p><strong>Nome:</strong> ${item.nome}</p>
                <p><strong>Data:</strong> ${dataFormatada}</p>
                <p><strong>Horário:</strong> ${item.horario}</p>
                <div class="acoes-solicitacao">
                    <button class="btn-editar" onclick="redirecionarParaEdicao(${index})">Editar</button>
                    <button class="btn-excluir" onclick="deletarSolicitacao(${index})">Excluir</button>
                </div>
            `;
            solicitacoesListaContainer.appendChild(itemDiv);
        });
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        const novaSolicitacao = {
            servico: agendamentoForm.servico.value,
            nome: agendamentoForm.nome.value,
            data: agendamentoForm.data.value,
            horario: agendamentoForm.horario.value
        };

        const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
        solicitacoes.push(novaSolicitacao);
        localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));

        agendamentoForm.reset();
        renderizarSolicitacoes();

        Swal.fire({
            title: "Bom trabalho!",
            text: "Solicitação enviada com sucesso!",
            icon: "success"
        });
    }

    // --- 4. EVENTOS E EXECUÇÃO INICIAL ---
    if (agendamentoForm) {
        agendamentoForm.addEventListener('submit', handleFormSubmit);
    }

    window.deletarSolicitacao = deletarSolicitacao;
    window.redirecionarParaEdicao = redirecionarParaEdicao;

    renderizarServicos();
    renderizarSolicitacoes();
});
