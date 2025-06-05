// Adiciona um ouvinte para o evento 'scroll' na janela, que executa a função onScroll sempre que o usuário rolar a página
window.addEventListener('scroll', onScroll)
// Função chamada ao rolar a página para atualizar a navegação e seções ativas
function onScroll() {
  // Chama função para mostrar a barra de navegação com efeito ao rolar
  showNavOnScroll(),                             
    showBackToTopButtonOnScroll(),               // Chama função para mostrar o botão de "voltar ao topo" ao rolar uma certa distância
    activateMenuAtCurrentSection(home),          // Ativa o menu correspondente à seção "home" quando está na área visível
    activateMenuAtCurrentSection(services),      // Ativa o menu correspondente à seção "services" quando está na área visível
    activateMenuAtCurrentSection(about),         // Ativa o menu correspondente à seção "about" quando está na área visível
    activateMenuAtCurrentSection(contact)        // Ativa o menu correspondente à seção "contact" quando está na área visível
}

// Função que ativa o item do menu referente à seção atual visível na tela
function activateMenuAtCurrentSection(section) {
  const targetLine = scrollY + innerHeight / 2     // Calcula a linha de referência: a posição vertical da rolagem + metade da altura da janela

  const sectionTop = section.offsetTop             // Obtém a distância do topo da página até o início da seção

  const sectionHeight = home.offsetHeight           // Obtém a altura da seção

  const sectionTopReachOrPassedTargetLine = targetLine >= sectionTop      // Verifica se a linha de referência já alcançou ou passou o topo da seção

  const sectionEndsAt = sectionTop + sectionHeight                        // Calcula a posição onde a seção termina (topo + altura)

  const sectionEndPassedTargetLine = sectionEndsAt <= targetLine          // Verifica se o fim da seção já passou a linha de referência
  
   // Determina se a linha de referência está dentro dos limites da seção (entre topo e fim)
  const sectionBoundaries =
    sectionTopReachOrPassedTargetLine && !sectionEndPassedTargetLine

  const sectionId = section.getAttribute('id') // Obtém o id da seção para buscar o item do menu correspondente

  const menuElement = document.querySelector(`.menu a[href*=${sectionId}]`) // Seleciona o elemento do menu cujo href contém o id da seção

  menuElement.classList.remove('active') // Remove a classe 'active' do item do menu (resetar estado)
  // Se a linha de referência está dentro dos limites da seção, adiciona a classe 'active' para destacar o menu
  if (sectionBoundaries) {
    menuElement.classList.add('active') 
  }
}

// Seleciona o elemento da barra de navegação pelo id 'navigation'
const nav = document.getElementById('navigation')

// Função que adiciona ou remove a classe 'scroll' da navegação conforme a rolagem
function showNavOnScroll() {
  if (scrollY > 0) {
    // Se a página estiver rolada para baixo (scroll maior que zero), adiciona classe para efeito na navegação
    nav.classList.add('scroll')
  } else {
    // Se estiver no topo da página, remove a classe para efeito padrão
    nav.classList.remove('scroll')
  }
}

// Função que mostra ou esconde o botão "voltar ao topo" com base na rolagem
function showBackToTopButtonOnScroll() {
  if (scrollY > 800) {
    // Se rolou mais de 800px para baixo, mostra o botão
    backToTopButton.classList.add('show')
  } else {
    // Caso contrário, esconde o botão
    backToTopButton.classList.remove('show')
  }
}


// Função para abrir o menu responsivo, adicionando uma classe ao body
function openMenu() {
  document.body.classList.add('menu-expanded')
  // Ao abrir o menu, define aria-expanded como true para acessibilidade
  const menuButton = document.getElementById('menu-button') // pega botão do menu (adapte o id se for diferente)
  if (menuButton) {
    menuButton.setAttribute('aria-expanded', 'true') // Atualiza aria-expanded
    // Foca no primeiro link do menu para navegação por teclado
    const firstMenuLink = document.querySelector('.menu a')
    if (firstMenuLink) {
      firstMenuLink.focus() // Move o foco para o primeiro item do menu
    }
  }
}
// Função para fechar o menu responsivo, removendo a classe do body
function closeMenu() {
  document.body.classList.remove('menu-expanded')
  // Ao fechar, atualiza aria-expanded para false
  const menuButton = document.getElementById('menu-button') // pega botão do menu (adapte o id se for diferente)
  if (menuButton) {
    menuButton.setAttribute('aria-expanded', 'false') // Atualiza aria-expanded
    menuButton.focus() // Retorna o foco para o botão que abriu o menu
  }
}

// Evento para abrir menu responsivo via teclado no botão (Enter ou Espaço)
// Adicione esse evento se o botão não for um <button> nativo, para garantir acessibilidade do teclado
const menuButton = document.getElementById('menu-button') // adapte se o id do botão for diferente
if (menuButton) {
  menuButton.addEventListener('keydown', (e) => {
    // Se pressionar Enter ou Espaço, abre o menu
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault() // Previne comportamento padrão da tecla
      openMenu() // Abre menu via teclado
    }
  })
}

// Inicializa o ScrollReveal com configurações para animação ao aparecer os elementos
ScrollReveal({
  origin: 'top',        // A animação começa do topo
  distance: '30px',     // O elemento se move 30px durante a animação
  duration: 900         // Duração da animação em milissegundos
}).reveal(`
  #home,               
  #home img,           
  #home .stats,         
  #services,            
  #services header,     
  #services .card,      
  #about,               
  #about header,        
  #about .content p,    
  #about .content img   
`)

let modalMostrado = false

window.addEventListener('scroll', () => {
  const scrollTotal = document.documentElement.scrollHeight
  const scrollAtual = window.innerHeight + window.scrollY

  // Quando estiver a menos de 720px do fim da página
  if (scrollTotal - scrollAtual < 720 && !modalMostrado) {
    modalMostrado = true
    setTimeout(() => {
      const modal = document.getElementById('modalContato') // Pega o modal
      modal.classList.remove('hidden')                      // Remove a classe hidden para mostrar modal
      modal.setAttribute('aria-hidden', 'false')            // Atualiza aria-hidden para acessibilidade
      modal.querySelector('.close-button').focus()          // Foca no botão de fechar para acessibilidade
      trapFocus(modal)                                       // Ativa o aprisionamento do foco dentro do modal (novo)
    }, 1500) //tempo de espera para abrir o modal 1.5 segundos
  }
})

// Função para aprisionar o foco dentro do modal para acessibilidade
function trapFocus(modal) {
  // Seleciona todos os elementos focáveis dentro do modal
  const focusableElements = modal.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  )
  const first = focusableElements[0]       // Primeiro elemento focável
  const last = focusableElements[focusableElements.length - 1] // Último elemento focável

  // Evento keydown para controlar navegação do foco com Tab e Shift+Tab
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return // Se não for Tab, ignora

    if (e.shiftKey) {
      // Shift + Tab: se o foco está no primeiro, volta para o último
      if (document.activeElement === first) {
        e.preventDefault()  // Previne sair do modal
        last.focus()        // Move foco para o último elemento focável
      }
    } else {
      // Tab simples: se o foco está no último, volta para o primeiro
      if (document.activeElement === last) {
        e.preventDefault()  // Previne sair do modal
        first.focus()       // Move foco para o primeiro elemento focável
      }
    }
  })
}

// Seleciona o botão de fechar modal para adicionar evento de fechamento
const closeModalBtn = document.querySelector('.close-button') // adapte se necessário
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    const modal = document.getElementById('modalContato')     // Pega o modal
    modal.classList.add('hidden')                             // Esconde o modal
    modal.setAttribute('aria-hidden', 'true')                 // Atualiza aria-hidden
    // Retorna foco para o botão/menu que abriu o modal, ou para o topo da página
    const menuButton = document.getElementById('menu-button') // pega botão do menu (ou outro botão relevante)
    if (menuButton) {
      menuButton.focus()                                       // Retorna o foco para botão do menu
    } else {
      // Se não houver botão específico, foca no body para evitar foco perdido
      document.body.focus()
    }
  })
}

// Fecha o modal com a tecla Escape para acessibilidade
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('modalContato')
    if (modal && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden')
      modal.setAttribute('aria-hidden', 'true')
      // Retorna foco para o botão/menu que abriu o modal, ou para o topo da página
      const menuButton = document.getElementById('menu-button')
      if (menuButton) {
        menuButton.focus()
      } else {
        document.body.focus()
      }
    }
  }
})
