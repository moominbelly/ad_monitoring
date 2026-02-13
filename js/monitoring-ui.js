// monitoring-ui.js - 검색광고 모니터링 UI 동작

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
    
    
    // === 조회 기간 타입 변경 ===
    const periodType = document.getElementById('periodType');
    const weeklyFilter = document.getElementById('weeklyFilter');
    const monthlyFilter = document.getElementById('monthlyFilter');

    // 초기값 설정 (사용자가 설정한 값 가져오기)
    const userSetting = 'weekly'; // 실제로는 API에서 가져옴

    if (periodType) {
        periodType.value = userSetting;
        togglePeriodFilter(userSetting);
        
        periodType.addEventListener('change', function() {
            togglePeriodFilter(this.value);
        });
    }

    function togglePeriodFilter(type) {
        if (type === 'weekly') {
            weeklyFilter.style.display = 'block';
            monthlyFilter.style.display = 'none';
            
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentWeek = getWeekNumber(now);
            
            document.getElementById('weekYear').value = currentYear;
            document.getElementById('weekNumber').value = currentWeek;
            
        } else if (type === 'monthly') {
            weeklyFilter.style.display = 'none';
            monthlyFilter.style.display = 'block';
            
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            
            document.getElementById('monthPicker').value = `${year}-${month}`;
        }
    }

    function getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    // === 범용 다중선택 드롭다운 함수 ===
    function initMultiSelectDropdown(config) {
        const trigger = document.getElementById(config.triggerId);
        const options = document.getElementById(config.optionsId);
        const selectedText = document.getElementById(config.selectedTextId);
        const allCheckbox = document.getElementById(config.allCheckboxId);
        const checkboxes = document.querySelectorAll(`input[name="${config.checkboxName}"]:not(#${config.allCheckboxId})`);
        
        // 요소가 없으면 종료 (페이지에 없는 경우)
        if (!trigger || !options) return;
        
        // 드롭다운 열기/닫기
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = options.style.display === 'block';
            
            // 다른 드롭다운 모두 닫기
            document.querySelectorAll('.multi-select-options').forEach(opt => {
                opt.style.display = 'none';
            });
            document.querySelectorAll('.multi-select-trigger').forEach(trig => {
                trig.classList.remove('open');
            });
            
            if (!isOpen) {
                options.style.display = 'block';
                trigger.classList.add('open');
            }
        });
        
        // 옵션 영역 클릭 시 이벤트 전파 방지
        options.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // 전체 체크박스
        if (allCheckbox) {
            allCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    // 전체 선택 시 → 개별 항목 모두 해제
                    checkboxes.forEach(cb => {
                        cb.checked = false;
                    });
                } else {
                    // 전체 해제 시 → 최소 1개 선택 필요
                    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
                    if (!anyChecked) {
                        this.checked = true;
                        alert('최소 1개 이상 선택해야 합니다.');
                        return;
                    }
                }
                updateSelectedText();
            });
        }
        
        // 개별 체크박스
        checkboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    // 개별 항목 선택 시 → 전체 해제
                    if (allCheckbox) allCheckbox.checked = false;
                } else {
                    // 해제 시 → 최소 1개 선택 유지
                    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
                    const allChecked = allCheckbox ? allCheckbox.checked : false;
                    
                    if (checkedCount === 0 && !allChecked) {
                        this.checked = true;
                        alert('최소 1개 이상 선택해야 합니다.');
                        return;
                    }
                }
                updateSelectedText();
            });
        });
        
        // 선택된 텍스트 업데이트
        function updateSelectedText() {
            if (allCheckbox && allCheckbox.checked) {
                selectedText.textContent = '전체';
            } else {
                const checked = Array.from(checkboxes).filter(cb => cb.checked);
                
                if (checked.length === 1) {
                    const label = checked[0].parentElement.textContent.trim();
                    selectedText.textContent = label;
                } else {
                    selectedText.textContent = `${checked.length}개 선택`;
                }
            }
        }
        
        // 초기 설정
        updateSelectedText();
    }

    // 외부 클릭 시 모든 드롭다운 닫기
    document.addEventListener('click', function() {
        document.querySelectorAll('.multi-select-options').forEach(opt => {
            opt.style.display = 'none';
        });
        document.querySelectorAll('.multi-select-trigger').forEach(trig => {
            trig.classList.remove('open');
        });
    });

    // === 브랜드 필터 초기화 ===
    initMultiSelectDropdown({
        triggerId: 'brandDropdownTrigger',
        optionsId: 'brandDropdownOptions',
        selectedTextId: 'brandSelectedText',
        allCheckboxId: 'brandAll',
        checkboxName: 'brands'
    });

    // === 키워드 필터 초기화 ===
    initMultiSelectDropdown({
        triggerId: 'keywordDropdownTrigger',
        optionsId: 'keywordDropdownOptions',
        selectedTextId: 'keywordSelectedText',
        allCheckboxId: 'keywordAll',
        checkboxName: 'keywords'
    });



    // === 필터 폼 제출 === 

    const filterForm = document.querySelector('.filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const filterData = collectFilterData();
            console.log('필터 데이터:', filterData);
            alert('검색 기능은 백엔드 API 연동이 필요합니다.');
        });
    }
    
    // === 새로고침 버튼 ===
    const refreshBtn = document.querySelector('.card-header .btn-primary');
    if (refreshBtn && refreshBtn.textContent.includes('새로고침')) {
        refreshBtn.addEventListener('click', function() {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-sync fa-spin"></i> 수집 중...';
            
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = '새로고침';
                updateLastUpdateTime();  // 이 줄 추가!
                alert('데이터가 업데이트되었습니다!');
            }, 1500);
        });
    }
        // === 최종 업데이트 시간 표시 ===
    function updateLastUpdateTime() {
        const lastUpdateTimeEl = document.getElementById('lastUpdateTime');
        
        if (lastUpdateTimeEl) {
            // 실제로는 API에서 가져옴

            // 임시: 현재 시간 표시 (개발용)
            const now = new Date();
            const formatted = now.getFullYear() + '-' + 
                            String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                            String(now.getDate()).padStart(2, '0') + ' ' +
                            String(now.getHours()).padStart(2, '0') + ':' +
                            String(now.getMinutes()).padStart(2, '0');
            
            lastUpdateTimeEl.textContent = formatted;
        }
    }

    // 페이지 로드 시 호출
    updateLastUpdateTime();

    // 새로고침 버튼 클릭 시에도 업데이트
    // (기존 refreshBtn 코드 안에서 setTimeout 후 호출)


    
    // === 엑셀 다운로드 버튼 ===
    const excelDownloadBtn = document.getElementById('excelDownloadBtn');

    if (excelDownloadBtn) {
        excelDownloadBtn.addEventListener('click', function() {
            // 버튼 비활성화
            excelDownloadBtn.disabled = true;
            excelDownloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 다운로드 중...';
            
            // 현재 필터 값 수집
            const filterData = collectFilterData();
            
            console.log('엑셀 다운로드 요청:', filterData);
            
            // 실제로는 API 호출

            // 임시: 2초 후 복구 (개발용)
            setTimeout(function() {
                resetExcelBtn();
                alert('엑셀 파일이 다운로드되었습니다!\n(실제로는 API 연동이 필요합니다)');
            }, 2000);
        });
    }

    // 필터 데이터 수집 함수
    function collectFilterData() {
        const periodType = document.getElementById('periodType');
        const brandSelect = document.querySelector('[name="brand"]') || document.querySelector('.filter-form select:nth-of-type(2)');
        const deviceSelect = document.querySelector('[name="device"]') || document.querySelector('.filter-form select:nth-of-type(3)');
        
        let periodData = {};
        
        // 기간 데이터 수집
        if (periodType) {
            const type = periodType.value;
            
            if (type === 'weekly') {
                periodData = {
                    type: 'weekly',
                    year: document.getElementById('weekYear')?.value || '',
                    week: document.getElementById('weekNumber')?.value || ''
                };
            } else if (type === 'monthly') {
                const monthValue = document.getElementById('monthPicker')?.value || '';
                const [year, month] = monthValue.split('-');
                periodData = {
                    type: 'monthly',
                    year: year || '',
                    month: month || ''
                };
            }
        }
        
        // 필터 데이터 조합
        const data = {
            period: periodData,
            brand: brandSelect?.value || 'all',
            device: deviceSelect?.value || 'all',
            advertiser_id: window.getSelectedAdvertiserId()
        };
        
        return data;
    }

    // 엑셀 버튼 원래대로 복구
    function resetExcelBtn() {
        if (excelDownloadBtn) {
            excelDownloadBtn.disabled = false;
            excelDownloadBtn.innerHTML = '<i class="fas fa-file-excel"></i> 엑셀 다운로드';
        }
    }



    // === 이미지 클릭 시 확대 보기 ===
    const adImages = document.querySelectorAll('.ad-img');
    adImages.forEach(img => {
        img.addEventListener('click', function() {
            // 간단한 확대 보기 (실제로는 모달이나 lightbox 사용)
            const imageUrl = this.src;
            const newWindow = window.open('', '_blank', 'width=800,height=600');
            newWindow.document.write(`
                <html>
                <head>
                    <title>광고 이미지</title>
                    <style>
                        body {
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background: #000;
                        }
                        img {
                            max-width: 90%;
                            max-height: 90vh;
                        }
                    </style>
                </head>
                <body>
                    <img src="${imageUrl}" alt="광고 이미지">
                </body>
                </html>
            `);
        });
    });
    
});
