// monitoring-settings-ui.js - 모니터링 설정 UI 동작

document.addEventListener('DOMContentLoaded', function() {
    
    // === 사이드바 활성화 상태 ===
    const sideNavLinks = document.querySelectorAll('.side-nav a');
    sideNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            sideNavLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    // === 경쟁사 브랜드 관리 (테이블 방식) ===
    const competitorNameInput = document.getElementById('competitorNameInput');
    const competitorDomainInput = document.getElementById('competitorDomainInput');
    const addCompetitorBtn = document.getElementById('addCompetitorBtn');
    const competitorTableBody = document.getElementById('competitorTableBody');

    // 경쟁사 데이터
    let competitors = [
        { name: '나이키', domain: 'nike.com' },
        { name: '아디다스', domain: 'adidas.com' },
        { name: '퓨마', domain: 'puma.com' }
    ];

    // 테이블 다시 그리기
    function renderCompetitorTable() {
        competitorTableBody.innerHTML = '';
        
        competitors.forEach((comp, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${comp.name}</td>
                <td>${comp.domain}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn btn-sm btn-danger competitor-delete" data-name="${comp.name}">삭제</button>
                </td>
            `;
            competitorTableBody.appendChild(tr);
        });
        
        // 삭제 버튼 이벤트 재등록
        document.querySelectorAll('.competitor-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                if (confirm(`${name}을(를) 삭제하시겠습니까?`)) {
                    competitors = competitors.filter(c => c.name !== name);
                    renderCompetitorTable();
                }
            });
        });
    }

    // 경쟁사 추가
    function addCompetitor() {
        const name = competitorNameInput.value.trim();
        const domain = competitorDomainInput.value.trim();
        
        if (!name || !domain) {
            alert('브랜드명과 도메인을 모두 입력해주세요.');
            return;
        }
        
        // 중복 체크
        if (competitors.some(c => c.domain === domain)) {
            alert('이미 추가된 브랜드입니다.');
            return;
        }
        
        // 추가
        competitors.push({ name, domain });
        renderCompetitorTable();
        
        // 입력 필드 초기화
        competitorNameInput.value = '';
        competitorDomainInput.value = '';
        competitorNameInput.focus();
    }

    // 추가 버튼 클릭
    if (addCompetitorBtn) {
        addCompetitorBtn.addEventListener('click', addCompetitor);
    }

    // Enter 키로 추가
    if (competitorDomainInput) {
        competitorDomainInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCompetitor();
            }
        });
    }

    // 초기 렌더링
    renderCompetitorTable();




    // =============================
    // === 태그 관련 변수 및 함수 ===
    // ==========================================
    
    const keywordInput = document.getElementById('keywordInput');
    const keywordTags = document.getElementById('keywordTags');
    
    
    // 태그 엘리먼트 생성 함수 (먼저 정의!)
    function createTagElement(text) {
        const span = document.createElement('span');
        span.className = 'tag-item';
        span.innerHTML = `
            ${text}
            <button type="button" class="tag-remove" data-tag="${text}">&times;</button>
        `;
        
        // 삭제 버튼 이벤트
        span.querySelector('.tag-remove').addEventListener('click', function() {
            span.remove();
        });
        
        return span;
    }
    
    
    // 태그 입력 설정 함수
    function setupTagInput(input, container) {
        if (!input || !container) return;
        
        // Enter 키로 태그 추가
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = this.value.trim();
                
                if (value) {
                    // 중복 체크
                    const existingTags = Array.from(container.querySelectorAll('.tag-item'))
                        .map(tag => tag.textContent.trim().replace('×', '').trim());
                    
                    if (existingTags.includes(value)) {
                        alert('이미 추가된 항목입니다.');
                        this.value = '';
                        return;
                    }
                    
                    // 태그 추가
                    const tagElement = createTagElement(value);
                    container.insertBefore(tagElement, input);
                    this.value = '';
                }
            }
        });
    }
    
    
    // 태그 입력 초기화
    setupTagInput(keywordInput, keywordTags);
    
    
    // 기존 태그 삭제 버튼 이벤트
    document.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.tag-item').remove();
        });
    });
    
        // ==========================================
    // === 일지 설정 토글 (추가!) ===
    // ==========================================
    
    // 브랜드 일지 설정 토글
    const brandReportWeekly = document.getElementById('brandReportWeekly');
    const brandReportMonthly = document.getElementById('brandReportMonthly');
    const brandWeeklySettings = document.getElementById('brandWeeklySettings');
    const brandMonthlySettings = document.getElementById('brandMonthlySettings');
    
    if (brandReportWeekly && brandReportMonthly) {
        brandReportWeekly.addEventListener('change', function() {
            if (this.checked) {
                brandWeeklySettings.style.display = 'block';
                brandMonthlySettings.style.display = 'none';
            }
        });
        
        brandReportMonthly.addEventListener('change', function() {
            if (this.checked) {
                brandWeeklySettings.style.display = 'none';
                brandMonthlySettings.style.display = 'block';
            }
        });
    }
    
    // 키워드 일지 설정 토글
    const keywordReportWeekly = document.getElementById('keywordReportWeekly');
    const keywordReportMonthly = document.getElementById('keywordReportMonthly');
    const keywordWeeklySettings = document.getElementById('keywordWeeklySettings');
    const keywordMonthlySettings = document.getElementById('keywordMonthlySettings');
    
    if (keywordReportWeekly && keywordReportMonthly) {
        keywordReportWeekly.addEventListener('change', function() {
            if (this.checked) {
                keywordWeeklySettings.style.display = 'block';
                keywordMonthlySettings.style.display = 'none';
            }
        });
        
        keywordReportMonthly.addEventListener('change', function() {
            if (this.checked) {
                keywordWeeklySettings.style.display = 'none';
                keywordMonthlySettings.style.display = 'block';
            }
        });
    }
    


    // ==========================================
    // === 폼 제출 (설정 저장) ===
    // ==========================================
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    
   if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', function() {
        
        // 키워드 수집
        const keywordTagsElement = document.getElementById('keywordTags');
        const keywords = Array.from(document.getElementById('keywordTags').querySelectorAll('.tag-item'))
            .map(tag => tag.textContent.trim().replace('×', '').trim());
            
                    
            // 폼 데이터 수집
            const formData = new FormData(monitoringSettingsForm);

            // 브랜드 디바이스 수집
            const brandDevices = [];
            if (document.querySelector('[name="brandDevicePC"]').checked) brandDevices.push('PC');
            if (document.querySelector('[name="brandDeviceMO"]').checked) brandDevices.push('MO');

            // 키워드 디바이스 수집
            const keywordDevices = [];
            if (document.querySelector('[name="keywordDevicePC"]').checked) keywordDevices.push('PC');
            if (document.querySelector('[name="keywordDeviceMO"]').checked) keywordDevices.push('MO');

            // 브랜드 일지 설정
            const brandReportType = formData.get('brandReport');
            let brandReportSchedule = {};
            if (brandReportType === 'weekly') {
                brandReportSchedule = {
                    type: 'weekly',
                    day: formData.get('brandWeeklyDay'),
                    time: formData.get('brandWeeklyTime')
                };
            } else {
                brandReportSchedule = {
                    type: 'monthly',
                    date: formData.get('brandMonthlyDate'),
                    time: formData.get('brandMonthlyTime')
                };
            }
            
            // 키워드 일지 설정
            const keywordReportType = formData.get('keywordReport');
            let keywordReportSchedule = {};
            if (keywordReportType === 'weekly') {
                keywordReportSchedule = {
                    type: 'weekly',
                    day: formData.get('keywordWeeklyDay'),
                    time: formData.get('keywordWeeklyTime')
                };
            } else {
                keywordReportSchedule = {
                    type: 'monthly',
                    date: formData.get('keywordMonthlyDate'),
                    time: formData.get('keywordMonthlyTime')
                };
            }
            
            const data = {
                competitors: competitors,
                keywords: keywords,
                brandInterval: formData.get('brandInterval'),
                brandReportSchedule: brandReportSchedule,
                keywordInterval: formData.get('keywordInterval'),
                keywordReportSchedule: keywordReportSchedule,
                 // data 객체에 추가
                brandDevices: brandDevices,
                keywordDevices: keywordDevices,
            };
            
            console.log('저장할 설정:', data);
            
            // 유효성 검사
            if (competitors.length === 0) {
                alert('경쟁사를 최소 1개 이상 입력해주세요.');
                return;
            }
            
            if (keywords.length === 0) {
                alert('키워드를 최소 1개 이상 입력해주세요.');
                return;
            }

            // 유효성 검사 추가
            if (brandDevices.length === 0) {
                alert('브랜드 수집 디바이스를 최소 1개 이상 선택해주세요.');
                return;
            }
            if (keywordDevices.length === 0) {
                alert('키워드 수집 디바이스를 최소 1개 이상 선택해주세요.');
                return;
            }
            
            // 실제로는 API 호출
            alert('설정이 저장되었습니다!');
        });
    }
    
    // ==========================================
    // === 초기화 버튼 ===
    // ==========================================
    const resetBtn = document.getElementById('resetBtn');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (confirm('모든 설정을 초기화하시겠습니까?')) {
                
                // 경쟁사 초기화 (테이블 방식)
                competitors = [
                    { name: '나이키', domain: 'nike.com' },
                    { name: '아디다스', domain: 'adidas.com' },
                    { name: '퓨마', domain: 'puma.com' }
                ];
                renderCompetitorTable();
                
                // 키워드 초기화 (태그 방식)
                const keywordTagsElement = document.getElementById('keywordTags');
                if (keywordTagsElement) {
                    keywordTagsElement.querySelectorAll('.tag-item').forEach(tag => tag.remove());
                }
                
                // 기본 키워드 다시 추가
                const defaultKeywords = ['운동화', '신발', '스니커즈', '러닝화'];
                defaultKeywords.forEach(keyword => {
                    const tag = createTagElement(keyword);
                    keywordTagsElement.insertBefore(tag, keywordInput);
                });
                
                // 주기 초기화
                document.querySelector('[name="brandWeeklyDay"]').value = '1';      // 월요일
                document.querySelector('[name="brandWeeklyHour"]').value = '0';     // 0시
                document.querySelector('[name="brandMonthlyDate"]').value = '1';    // 1일
                document.querySelector('[name="brandMonthlyHour"]').value = '0';    // 0시

                document.querySelector('[name="keywordWeeklyDay"]').value = '1';    // 월요일
                document.querySelector('[name="keywordWeeklyHour"]').value = '0';   // 0시
                document.querySelector('[name="keywordMonthlyDate"]').value = '1';  // 1일
                document.querySelector('[name="keywordMonthlyHour"]').value = '0';  // 0시
                
                // 디바이스 체크박스 초기화
                document.querySelector('[name="brandDevicePC"]').checked = true;
                document.querySelector('[name="brandDeviceMO"]').checked = true;
                document.querySelector('[name="keywordDevicePC"]').checked = true;
                document.querySelector('[name="keywordDeviceMO"]').checked = true;
                
                // 일지 설정 초기화
                document.getElementById('brandReportWeekly').checked = true;
                document.getElementById('keywordReportWeekly').checked = true;
                brandWeeklySettings.style.display = 'block';
                brandMonthlySettings.style.display = 'none';
                keywordWeeklySettings.style.display = 'block';
                keywordMonthlySettings.style.display = 'none';
                
                alert('설정이 초기화되었습니다.');
            }
        });
    }
    
}); // DOMContentLoaded 끝