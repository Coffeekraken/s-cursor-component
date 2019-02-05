module.exports = {
  // server port
  port: 3000,

  // title
  title: 's-cursor-component',

  // layout
  layout: 'right',

  // compile server
  compileServer: {
    // compile server port
    port: 4000
  },

  // editors
  editors: {
    html: {
      language: 'html',
      data: `
        <div class="m-b">
          <button class="btn btn--primary">
            Hello world
          </button><button class="btn btn--secondary">
            Hello
          </button><button class="btn">
            World
          </button><button class="btn btn--secondary">
            He
          </button>
        </div>

        <ul class="menu m-b">
          <li class="menu__item" cursor="fit">
            <s-icon driver="fontawesome" icon="far fa-user"></s-icon>
          </li>
          <li class="menu__item" cursor="fit">
            <s-icon driver="fontawesome" icon="fas fa-ad"></s-icon>
          </li>
          <li class="menu__item" cursor="fit">
            <s-icon driver="fontawesome" icon="fas fa-align-center"></s-icon>
          </li>
          <li class="menu__item" cursor="fit">
            <s-icon driver="fontawesome" icon="far fa-user"></s-icon>
          </li>
        </ul>

        <ul class="menu menu--text">
          <li class="menu__item" cursor="fit-square" cursor-class="underline">
            Menu item #1
          </li>
          <li class="menu__item" cursor="fit-square" cursor-class="underline">
            Menu item #2
          </li>
          <li class="menu__item" cursor="fit-square" cursor-class="underline">
            Menu item #3
          </li>
          <li class="menu__item" cursor="fit-square" cursor-class="underline">
            Menu item #4
          </li>
        </ul>

        <s-cursor class="cursor" hide-default-cursor enable-focus>
          <div class="cursor__pointer" cursor-pointer></div>
          <div class="cursor__sticked" cursor-sticked></div>
        </s-cursor>
      `
    },
    css: {
      language: 'scss',
      data: `
        @import 'node_modules/coffeekraken-sugar/index';
        @import 'node_modules/coffeekraken-s-typography-component/index';
        @import 'node_modules/coffeekraken-s-button-component/index';
        @include s-init();
        @include s-classes();
        @include s-typography-classes();
        @include s-button-classes();
        body {
          padding: s-space(bigger);
        }
        .cursor {
          &.sticked {
            &.underline {
              .cursor__sticked {
                border-width: 0;
                border-bottom-width: 2px;
              }
            }
          }
          .cursor__pointer {
            display: block;
            position: absolute;
            top: 50%; left: 50%;
            width:5px; height:5px;
            background: s-color(primary);
            border-radius: 50%;
            transform: translateX(-50%) translateY(-50%);
            transition: width .3s cubic-bezier(1,0,0,1) 0s,
                        height .3s cubic-bezier(1,0,0,1) 0s,
                        opacity .3s cubic-bezier(1,0,0,1) 0s;
          }
          .cursor__sticked {
            width: 30px; height: 30px;
            border: 1px solid s-color(primary, -opacity .3);
            border-radius: 50%;
            position: absolute;
            left: 50%; top: 50%;
            transform: translateX(-50%) translateY(-50%);
            transition: transform .3s cubic-bezier(1,0,0,1) 0s,
                        border .3s cubic-bezier(1,0,0,1) 0s;
          }
          &.sticked .cursor__sticked {
            border: 2px solid s-color(primary);
          }
        }

        .menu {
        }
          .menu__item {
            display: inline-block;
            width: 50px; height: 50px;
            padding: 18px 0;
            text-align: center;
          }
        .menu--text {
          .menu__item {
            width: auto;
            height: 30px;
            line-height:30px;
            padding: 0 s-rem(15px);
          }
        }
      `
    },
    js: {
      language: 'js',
      data: `
        import SIconComponent from 'coffeekraken-s-icon-component'
        import SCursorComponent from './dist/index'
        SCursorComponent.applyHandlerOn('fit-square', '.btn')
      `
    }
  }
}
