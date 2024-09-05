const fixedButton = {
    position: 'fixed',
    top: '80%',
    left: '90%',
    // transform: 'translate(-50%, -50%)',
    zIndex: 1,
    cursor: 'pointer',
    backgroundColor: 'rgba(72, 122, 180, .4)',
    borderRadius: '50%',
    display: 'flex', // Flexbox 사용
    alignItems: 'center', // 수직 중앙 정렬
    justifyContent: 'center', // 수평 중앙 정렬
    width: '100px', // 버튼의 너비
    height: '100px', // 버튼의 높이
};

export default fixedButton;
