// common.js 

document.addEventListener('DOMContentLoaded', function() {
    
    // === 현재 사용자 정보 조회 ===
    async function loadUserInfo() {
        try {
            // 실제로는 API 호출
            // 임시 데이터 (개발용)
            const userData = {
                user_id: 'user001',
                user_name: '홍길동',
                role: 'admin', // 'admin', 'team_leader', 'team_user'
                advertisers: [
                    { advertiser_id: 'adv001', advertiser_name: '광고주 A' },
                    { advertiser_id: 'adv002', advertiser_name: '광고주 B' },
                    { advertiser_id: 'adv003', advertiser_name: '광고주 C' }
                ]
            };
            
            // 사용자 이름 표시
            const userNameEl = document.getElementById('userName');
            if (userNameEl) {
                userNameEl.textContent = userData.user_name + '님';
            }
            
            // 광고주 드롭다운 생성
            loadAdvertiserDropdown(userData);
            
        } catch (error) {
            console.error('사용자 정보 로드 실패:', error);
        }
    }
    
    
    // === 광고주 드롭다운 생성 ===
    function loadAdvertiserDropdown(userData) {
        const dropdown = document.getElementById('advertiserDropdown');
        if (!dropdown) return;
        
        // 기존 옵션 제거
        dropdown.innerHTML = '';
        
        // Admin/팀장인 경우 "전체" 옵션 추가
        if (userData.role === 'admin' || userData.role === 'team_leader') {
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = '전체 광고주';
            dropdown.appendChild(allOption);
        }
        
        // 광고주 목록 추가
        userData.advertisers.forEach(advertiser => {
            const option = document.createElement('option');
            option.value = advertiser.advertiser_id;
            option.textContent = advertiser.advertiser_name;
            dropdown.appendChild(option);
        });
        
        // 저장된 광고주 선택 복원
        const savedAdvertiser = localStorage.getItem('selected_advertiser_id');
        if (savedAdvertiser) {
            dropdown.value = savedAdvertiser;
        } else {
            // 저장된 값 없으면 첫 번째 선택
            const firstValue = dropdown.options[0].value;
            dropdown.value = firstValue;
            localStorage.setItem('selected_advertiser_id', firstValue);
        }
        
        // 드롭다운 변경 이벤트
        dropdown.addEventListener('change', handleAdvertiserChange);
    }
    
    
    // === 광고주 변경 처리 ===
    function handleAdvertiserChange(event) {
        const selectedId = event.target.value;
        
        // localStorage에 저장
        localStorage.setItem('selected_advertiser_id', selectedId);
        
        // 현재 페이지 새로고침 (데이터 다시 로드)
        console.log('광고주 변경:', selectedId);
        window.location.reload();
    }
    
    
    // === 현재 선택된 광고주 ID 가져오기 (다른 JS에서 사용) ===
    window.getSelectedAdvertiserId = function() {
        return localStorage.getItem('selected_advertiser_id');
    };
    
    
    // === 로그아웃 ===
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('로그아웃 하시겠습니까?')) {
                // localStorage 초기화
                localStorage.clear();
                
                // 실제로는 로그아웃 API 호출
                // await fetch('/api/logout', { method: 'POST' });
                
                // 로그인 페이지로 이동
                alert('로그아웃되었습니다.');
                // window.location.href = 'login.html';
            }
        });
    }
    // === 사이드바 카테고리 토글 ===
document.querySelectorAll('.category-title').forEach(title => {
    title.addEventListener('click', function(e) {
        e.preventDefault();
        
        const category = this.closest('.nav-category');
        const isOpen = category.classList.contains('open');
        
        // 다른 카테고리 닫기 (원하면 이 부분 제거)
        // document.querySelectorAll('.nav-category').forEach(cat => {
        //     cat.classList.remove('open');
        // });
        
        // 현재 카테고리 토글
        if (isOpen) {
            category.classList.remove('open');
        } else {
            category.classList.add('open');
        }
    });
});

    // 서브 메뉴 active 상태
    document.querySelectorAll('.sub-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 모든 서브 메뉴에서 active 제거
            document.querySelectorAll('.sub-menu a').forEach(a => a.classList.remove('active'));
            
            // 클릭한 메뉴에 active 추가
            this.classList.add('active');
        });
    });

    // 초기 로드 시 첫 번째 카테고리 열기 (선택사항)
    document.querySelector('.nav-category')?.classList.add('open');


    
    // === 초기화 ===
    loadUserInfo();
});
