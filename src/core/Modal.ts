export default class Modal {
    private options: any; // 默认配置和用户配置
    private backdrop: any; // 背景遮罩
    private container: any; // 模态框容器
    content?: HTMLDivElement; // 内容框
    header?: HTMLDivElement; // 标题栏
    title?: HTMLHeadingElement; // 标题
    body?: HTMLDivElement; // 内容区域
    footer: any; // 底部区域
    closeBtn?: HTMLButtonElement; // 关闭按钮
    cancelBtn?: HTMLButtonElement; // 取消按钮
    confirmBtn?: HTMLButtonElement; // 确认按钮
    isOpen?: boolean; // 是否已打开
    constructor(options = {}) {
        // 默认配置
        this.options = {
            title: '提示',
            content: '这是一个弹窗',
            confirmText: '确认',
            cancelText: '取消',
            onConfirm: () => { },
            onCancel: () => { },
            width: '500px',
            animate: true
        };

        // 合并用户配置
        Object.assign(this.options, options);

        // 创建模态框元素
        this.createElements();

        // 绑定事件
        this.bindEvents()

    }

    mount() {
        // 添加到文档
        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.container);
    }

    // 创建所有DOM元素
    createElements() {
        // 创建背景遮罩
        this.backdrop = document.createElement('div');
        this.backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1000;
    `;

        // 创建容器
        this.container = document.createElement('div');
        this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1001;
      padding: 20px;
    `;

        // 创建内容框
        this.content = document.createElement('div');
        this.content.style.cssText = `
      background: white;
      border-radius: 8px;
      width: ${this.options.width};
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      transform: scale(0.9);
      opacity: 0;
      transition: all 0.3s ease;
    `;

        // 创建标题栏
        this.header = document.createElement('div');
        this.header.style.cssText = `
      padding: 16px 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

        this.title = document.createElement('h3');
        this.title.style.cssText = `
      margin: 0;
      font-size: 18px;
      color: #333;
    `;
        this.title.textContent = this.options.title;

        this.closeBtn = document.createElement('button');
        this.closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    `;
        this.closeBtn.textContent = '×';
        this.closeBtn.onmouseover = () => {
            this.closeBtn && (this.closeBtn.style.backgroundColor = '#f5f5f5');
            this.closeBtn && (this.closeBtn.style.color = '#333');
        };
        this.closeBtn.onmouseout = () => {
            this.closeBtn && (this.closeBtn.style.backgroundColor = '');
            this.closeBtn && (this.closeBtn.style.color = '');
        };

        // 创建内容区域
        this.body = document.createElement('div');
        this.body.style.cssText = `
      padding: 20px;
      font-size: 14px;
      color: #666;
    `;
        this.body.innerHTML = this.options.content;

        // 创建按钮区域
        this.footer = document.createElement('div');
        this.footer.style.cssText = `
      padding: 12px 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    `;

        this.cancelBtn = document.createElement('button');
        this.cancelBtn.style.cssText = `
      padding: 6px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 14px;
      color: #666;
    `;
        this.cancelBtn.textContent = this.options.cancelText;
        this.cancelBtn.onmouseover = () => {
            this.cancelBtn && (this.cancelBtn.style.backgroundColor = '#f5f5f5');
        };
        this.cancelBtn.onmouseout = () => {
            this.cancelBtn && (this.cancelBtn.style.backgroundColor = '');
        };

        this.confirmBtn = document.createElement('button');
        this.confirmBtn.style.cssText = `
      padding: 6px 16px;
      border: none;
      border-radius: 4px;
      background: #1677ff;
      cursor: pointer;
      font-size: 14px;
      color: white;
    `;
        this.confirmBtn.textContent = this.options.confirmText;
        this.confirmBtn.onmouseover = () => {
            this.confirmBtn && (this.confirmBtn.style.backgroundColor = '#0f62d9');
        };
        this.confirmBtn.onmouseout = () => {
            this.confirmBtn && (this.confirmBtn.style.backgroundColor = '');
        };

        // 组装元素
        this.header.appendChild(this.title);
        this.header.appendChild(this.closeBtn);

        this.footer.appendChild(this.cancelBtn);
        this.footer.appendChild(this.confirmBtn);

        this.content.appendChild(this.header);
        this.content.appendChild(this.body);
        this.content.appendChild(this.footer);

        this.container.appendChild(this.content);
    }

    closeEvent() {
        this.options.onCancel();
        this.destroy();
    }

    confirmEvent() {
        this.options.onConfirm();
        this.destroy();
    }

    ESCEvent(e: KeyboardEvent) {
        if (e.key === 'Escape' && this.isOpen) {
            this.options.onCancel();
            this.destroy();
        }
    }

    // 绑定事件
    bindEvents() {
        // 关闭按钮
        this.closeBtn && this.closeBtn.addEventListener('click', this.closeEvent.bind(this));

        // 取消按钮
        this.cancelBtn && this.cancelBtn.addEventListener('click', this.closeEvent.bind(this));

        // 确认按钮
        this.confirmBtn && this.confirmBtn.addEventListener('click', this.confirmEvent.bind(this));

        // 点击背景关闭
        this.backdrop && this.backdrop.addEventListener('click', this.closeEvent.bind(this));

        // ESC键关闭
        document.addEventListener('keydown', this.ESCEvent.bind(this));
    }

    // 移除事件
    unbindEvents() {
        this.closeBtn && this.closeBtn.removeEventListener('click', this.closeEvent.bind(this));
        this.cancelBtn && this.cancelBtn.removeEventListener('click', this.closeEvent.bind(this));
        this.confirmBtn && this.confirmBtn.removeEventListener('click', this.confirmEvent.bind(this));
        this.backdrop && this.backdrop.removeEventListener('click', this.closeEvent.bind(this));
        document.removeEventListener('keydown', this.ESCEvent.bind(this));
    }

    // 打开模态框
    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        // 挂载元素
        this.mount();
        // 显示元素
        this.backdrop.style.display = 'block';
        this.container.style.display = 'flex';

        // 防止页面滚动
        document.body.style.overflow = 'hidden';

        // 触发动画
        setTimeout(() => {
            this.backdrop.style.opacity = '1';
            this.content && (this.content.style.transform = 'scale(1)');
            this.content && (this.content.style.opacity = '1');
        }, 10);
    }

    // 关闭模态框
    close() {
        this.isOpen = false;
        // 反向动画
        this.backdrop.style.opacity = '0';
        this.content && (this.content.style.transform = 'scale(0.9)');
        this.content && (this.content.style.opacity = '0');

        // 恢复页面滚动
        document.body.style.overflow = '';

        // 动画结束后隐藏
        setTimeout(() => {
            this.backdrop.style.display = 'none';
            this.container.style.display = 'none';
        }, 300);
    }

    // 销毁模态框
    destroy() {
        if (!this.isOpen) return;
        this.close();
        setTimeout(() => {
            document.body.removeChild(this.backdrop);
            document.body.removeChild(this.container);
        }, 300);
    }
}
