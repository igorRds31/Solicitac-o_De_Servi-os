document.addEventListener('DOMContentLoaded', () => {
    const editarForm = document.getElementById('editar-form');
    const btnCancelar = document.getElementById('btn-cancelar');
    const servicoSelect = document.getElementById('servico-select');
    const indiceOriginal = document.getElementById('indice-original');

    // Carrega os serviços no select
    function carregarServicos() {
        const servicos = [
            { id: 1, nome: "Psicologo" },
            { id: 2, nome: "Oftalmologista" },
            { id: 3, nome: "Dentista" },
            { id: 4, nome: "Clinico Geral" },
            { id: 5, nome: "Gastroenterologia" },
            { id: 6, nome: "Dermatologia" }
        ];

        servicoSelect.innerHTML = '<option value="">Selecione...</option>';
        servicos.forEach(servico => {
            const option = document.createElement('option');
            option.value = servico.nome;
            option.textContent = servico.nome;
            servicoSelect.appendChild(option);
        });
    }

    // Carrega os dados da solicitação que será editada
    function carregarDadosEdicao() {
        const indice = localStorage.getItem('indiceEdicao');
        const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
        
        if (indice === null || indice < 0 || indice >= solicitacoes.length) {
            Swal.fire({
                title: "Erro!",
                text: "Solicitação não encontrada.",
                icon: "error",
                confirmButtonColor: '#d33'
            }).then(() => {
                window.location.href = 'solicitacoes.html';
            });
            return;
        }

        const solicitacao = solicitacoes[indice];
        
        // Preenche o formulário
        servicoSelect.value = solicitacao.servico;
        editarForm.nome.value = solicitacao.nome;
        editarForm.data.value = solicitacao.data;
        editarForm.horario.value = solicitacao.horario;
        indiceOriginal.value = indice;
    }

    // Salva as alterações
    function salvarEdicao(event) {
        event.preventDefault();

        const indice = parseInt(indiceOriginal.value);
        const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
        
        if (indice < 0 || indice >= solicitacoes.length) {
            Swal.fire({
                title: "Erro!",
                text: "Solicitação não encontrada.",
                icon: "error",
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Atualiza a solicitação
        solicitacoes[indice] = {
            servico: editarForm.servico.value,
            nome: editarForm.nome.value,
            data: editarForm.data.value,
            horario: editarForm.horario.value
        };

        localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
        
        Swal.fire({
            title: "Sucesso!",
            text: "Solicitação atualizada com sucesso!",
            icon: "success",
            confirmButtonColor: '#28a745'
        }).then(() => {
            // Limpa o índice de edição e redireciona
            localStorage.removeItem('indiceEdicao');
            window.location.href = 'solicitacoes.html';
        });
    }

    // Cancela a edição
    function cancelarEdicao() {
        Swal.fire({
            title: "Cancelar Edição",
            text: "Deseja realmente cancelar? As alterações serão perdidas.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, cancelar",
            cancelButtonText: "Continuar editando",
            confirmButtonColor: '#d33',
            cancelButtonColor: '#28a745'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('indiceEdicao');
                window.location.href = 'solicitacoes.html';
            }
        });
    }

    // Event Listeners
    editarForm.addEventListener('submit', salvarEdicao);
    btnCancelar.addEventListener('click', cancelarEdicao);

    // Execução inicial
    carregarServicos();
    carregarDadosEdicao();
});