/**
 * 카카오지하철 UX/UI 개선 인터랙션 스크립트
 * Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 상태 및 내비게이션 히스토리 관리
  const historyStack = ['home'];
  let currentScreen = 'home';

  // 2. DOM 요소 캐싱
  const screens = document.querySelectorAll('.screen');
  const navItems = document.querySelectorAll('.bottom-nav__item');
  const toastEl = document.getElementById('toast');
  const appBarTitle = document.getElementById('appBarTitle');
  const backBtn = document.getElementById('appBarBack');

  const titlesByScreen = {
    'home': '카카오지하철',
    'route-list': '경로 검색 결과',
    'train-detail': '열차 상세 정보',
    'delay-status': '실시간 지연 안내',
    'alternative': '대안 경로 안내',
    'normal-status': '열차 운행 상태',
    'favorites': '즐겨찾는 경로',
    'alerts': '운행 알림 센터',
    'settings': '설정'
  };

  /**
   * 화면 전환 함수
   * @param {string} targetScreenId 
   * @param {boolean} isBack 
   */
  function navigateTo(targetScreenId, isBack = false) {
    if (!targetScreenId) return;

    // 히스토리 갱신
    if (!isBack) {
      if (currentScreen !== targetScreenId) {
        historyStack.push(targetScreenId);
      }
    }

    currentScreen = targetScreenId;

    // 화면 노출/비노출 토글
    screens.forEach(screen => {
      if (screen.dataset.screen === targetScreenId) {
        screen.classList.add('screen--active');
        screen.scrollTop = 0;
      } else {
        screen.classList.remove('screen--active');
      }
    });

    // 헤더 타이틀 및 뒤로가기 버튼 표시 제어
    if (appBarTitle) {
      appBarTitle.textContent = titlesByScreen[targetScreenId] || '카카오지하철';
    }

    if (backBtn) {
      if (targetScreenId === 'home') {
        backBtn.style.visibility = 'hidden';
      } else {
        backBtn.style.visibility = 'visible';
      }
    }

    // 하단 탭 활성화 상태 동기화
    navItems.forEach(item => {
      const tabTarget = item.dataset.tab;
      if (tabTarget === targetScreenId) {
        item.classList.add('bottom-nav__item--active');
      } else {
        item.classList.remove('bottom-nav__item--active');
      }
    });
  }

  /**
   * 뒤로가기 동작
   */
  function goBack() {
    if (historyStack.length > 1) {
      historyStack.pop(); // 현재 화면 제거
      const prevScreen = historyStack[historyStack.length - 1];
      navigateTo(prevScreen, true);
    } else {
      navigateTo('home', true);
    }
  }

  /**
   * 토스트 메시지 안내
   * @param {string} msg 
   */
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('toast--visible');
    setTimeout(() => {
      toastEl.classList.remove('toast--visible');
    }, 2500);
  }

  // 3. 글로벌 클릭 이벤트 바인딩 (Data attributes 기반)
  document.addEventListener('click', (e) => {
    // 뒤로가기 버튼
    const backTrigger = e.target.closest('#appBarBack');
    if (backTrigger) {
      goBack();
      return;
    }

    // 네비게이션 트리거 (data-navigate)
    const navTrigger = e.target.closest('[data-navigate]');
    if (navTrigger) {
      e.preventDefault();
      const targetScreen = navTrigger.dataset.navigate;
      navigateTo(targetScreen);
      return;
    }

    // 하단 네비게이션 탭 클릭 (data-tab)
    const tabTrigger = e.target.closest('[data-tab]');
    if (tabTrigger) {
      e.preventDefault();
      const tabName = tabTrigger.dataset.tab;
      navigateTo(tabName);
      return;
    }

    // 역 스왑(반전) 버튼
    const swapBtn = e.target.closest('#btnSwapStations');
    if (swapBtn) {
      const startInput = document.getElementById('inputDeparture');
      const endInput = document.getElementById('inputArrival');
      if (startInput && endInput) {
        const temp = startInput.value;
        startInput.value = endInput.value;
        endInput.value = temp;
        showToast('출발역과 도착역이 변경되었습니다.');
      }
      return;
    }

    // 대안 경로 채택 버튼
    const selectAltBtn = e.target.closest('[data-select-alt]');
    if (selectAltBtn) {
      const altName = selectAltBtn.dataset.selectAlt;
      showToast(`'${altName}' 경로로 적용되었습니다.`);
      setTimeout(() => {
        navigateTo('route-list');
      }, 500);
      return;
    }
  });

  // 초기 화면 설정
  navigateTo('home', true);
});
