
const axios = require('axios');

const paymentRequest = async () => {
    try {
        const response = await axios.post('https://api.tosspayments.com/v1/payments', {
            // 결제 요청에 필요한 데이터
            amount: 10000,
            orderId: "ORDER_ID_" + new Date().getTime(),
            orderName: '테스트 상품',
            // 추가 필요한 파라미터...
        }, {
            headers: {
                // 토스페이먼츠에서 제공하는 API 키를 사용해야 합니다.
                'Authorization': 'Basic YOUR_API_KEY',
                'Content-Type': 'application/json',
            }
        });

        console.log(response.data); // 결제 요청 응답 처리
    } catch (error) {
        console.error(error); // 오류 처리
    }
};

paymentRequest();
