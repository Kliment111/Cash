// DІЯ-style swipe navigation - адаптированный под существующую структуру

class DiaSwipeNavigation {
    constructor() {
        this.currentPanel = 0;
        this.panels = ['income', 'expense', 'assets', 'liabilities'];
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        this.startTranslateX = 0;
        this.currentTranslateX = 0;
        this.container = null;
        this.content = null;
        
        this.init();
    }

    init() {
        this.container = document.querySelector('.dia-container');
        this.content = document.querySelector('.dia-content');
        
        if (!this.container || !this.content) return;

        this.setupEventListeners();
        this.updatePanels();
        this.setupTabNavigation();
    }

    setupEventListeners() {
        // Touch events для мобильных
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Mouse events для десктопа
        this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.container.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

        // Предотвращаем выделение текста во время свайпа
        this.container.addEventListener('selectstart', (e) => {
            if (this.isDragging) e.preventDefault();
        });
    }

    setupTabNavigation() {
        const tabs = document.querySelectorAll('.dia-tab');
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                this.goToPanel(index);
            });
        });
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.startTranslateX = this.currentTranslateX;
        this.isDragging = true;
        this.container.classList.add('swiping');
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const diffX = currentX - this.touchStartX;
        
        // Добавляем сопротивление на краях
        if ((this.currentPanel === 0 && diffX > 0) || 
            (this.currentPanel === this.panels.length - 1 && diffX < 0)) {
            this.currentTranslateX = this.startTranslateX + diffX * 0.3;
        } else {
            this.currentTranslateX = this.startTranslateX + diffX;
        }
        
        this.updateTransform();
    }

    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        this.touchEndX = e.changedTouches[0].clientX;
        const diffX = this.touchEndX - this.touchStartX;
        
        this.isDragging = false;
        this.container.classList.remove('swiping');
        
        // Определяем, нужно ли переключать панели
        const threshold = this.container.offsetWidth * 0.2;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && this.currentPanel > 0) {
                this.goToPanel(this.currentPanel - 1);
            } else if (diffX < 0 && this.currentPanel < this.panels.length - 1) {
                this.goToPanel(this.currentPanel + 1);
            } else {
                this.snapToCurrentPanel();
            }
        } else {
            this.snapToCurrentPanel();
        }
    }

    handleMouseDown(e) {
        this.touchStartX = e.clientX;
        this.startTranslateX = this.currentTranslateX;
        this.isDragging = true;
        this.container.classList.add('swiping');
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const currentX = e.clientX;
        const diffX = currentX - this.touchStartX;
        
        // Добавляем сопротивление на краях
        if ((this.currentPanel === 0 && diffX > 0) || 
            (this.currentPanel === this.panels.length - 1 && diffX < 0)) {
            this.currentTranslateX = this.startTranslateX + diffX * 0.3;
        } else {
            this.currentTranslateX = this.startTranslateX + diffX;
        }
        
        this.updateTransform();
        e.preventDefault();
    }

    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        this.touchEndX = e.clientX;
        const diffX = this.touchEndX - this.touchStartX;
        
        this.isDragging = false;
        this.container.classList.remove('swiping');
        
        // Определяем, нужно ли переключать панели
        const threshold = this.container.offsetWidth * 0.2;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && this.currentPanel > 0) {
                this.goToPanel(this.currentPanel - 1);
            } else if (diffX < 0 && this.currentPanel < this.panels.length - 1) {
                this.goToPanel(this.currentPanel + 1);
            } else {
                this.snapToCurrentPanel();
            }
        } else {
            this.snapToCurrentPanel();
        }
    }

    goToPanel(index) {
        if (index < 0 || index >= this.panels.length) return;
        
        this.currentPanel = index;
        this.updatePanels();
        this.snapToCurrentPanel();
    }

    updatePanels() {
        // Обновляем видимость панелей
        const panels = document.querySelectorAll('.dia-panel');
        panels.forEach((panel, index) => {
            panel.classList.toggle('active', index === this.currentPanel);
        });

        // Обновляем состояние табов
        const tabs = document.querySelectorAll('.dia-tab');
        tabs.forEach((tab, index) => {
            tab.classList.toggle('active', index === this.currentPanel);
        });
    }

    snapToCurrentPanel() {
        this.currentTranslateX = -this.currentPanel * this.container.offsetWidth;
        this.updateTransform();
    }

    updateTransform() {
        this.content.style.transform = `translateX(${this.currentTranslateX}px)`;
    }

    // Обработка изменения размера окна
    handleResize() {
        this.snapToCurrentPanel();
    }
}

// Инициализация когда DOM готов
document.addEventListener('DOMContentLoaded', () => {
    const diaNavigation = new DiaSwipeNavigation();
    
    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            diaNavigation.handleResize();
        }, 250);
    });
    
    // Делаем доступным глобально
    window.diaNavigation = diaNavigation;
});

// Клавиатурная навигация
document.addEventListener('keydown', (e) => {
    if (!window.diaNavigation) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            window.diaNavigation.goToPanel(window.diaNavigation.currentPanel - 1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            window.diaNavigation.goToPanel(window.diaNavigation.currentPanel + 1);
            break;
    }
});
