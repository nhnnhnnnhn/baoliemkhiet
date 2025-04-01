# Hướng dẫn quản lý tệp âm thanh

Thư mục này chứa tất cả các tệp âm thanh được sử dụng trong ứng dụng Báo Liêm Khiết. Để duy trì tính nhất quán và hiệu suất tốt, vui lòng tuân thủ các quy tắc sau đây.

## Cấu trúc phân loại

Tùy thuộc vào mục đích sử dụng, hãy tổ chức tệp âm thanh theo các thư mục con (nếu cần):

- `/interviews/` - Đoạn âm thanh phỏng vấn
- `/podcasts/` - Podcast và bài phát thanh
- `/notifications/` - Âm thanh thông báo trong ứng dụng
- `/ui/` - Âm thanh tương tác giao diện người dùng

## Quy tắc đặt tên

1. Sử dụng chữ thường và dấu gạch ngang để ngăn cách các từ (ví dụ: `phong-van-chu-tich.mp3`)
2. Bắt đầu tên file với mục đích hoặc loại âm thanh (ví dụ: `interview-nguyen-van-a.mp3`, `notification-new-message.mp3`)
3. Thêm ngày tháng vào cuối tên nếu nội dung liên quan đến thời gian cụ thể (ví dụ: `podcast-thoi-su-2023-05-20.mp3`)

## Yêu cầu về định dạng và kích thước

### Định dạng
- **MP3**: Định dạng chính để đảm bảo tương thích trên các trình duyệt
- **WAV**: Cho chất lượng cao khi cần thiết
- **OGG**: Định dạng thay thế cho các trình duyệt hiện đại

### Chất lượng và dung lượng
- **Bitrate khuyến nghị**: 
  - Nhạc/Podcast: 128-192 Kbps
  - Giọng nói/Phỏng vấn: 96-128 Kbps
  - Âm thanh UI: 64-96 Kbps
- **Tần số lấy mẫu**: 44.1 kHz cho âm nhạc, 22.05-44.1 kHz cho giọng nói
- **Kênh**: Stereo cho âm nhạc, Mono cho giọng nói và thông báo UI

### Dung lượng tối đa
- **Podcast dài**: 30MB (~ 30 phút ở 128 Kbps)
- **Phỏng vấn/Clip ngắn**: 5MB
- **Âm thanh UI**: 100KB

## Hướng dẫn nhúng âm thanh

### Sử dụng thẻ audio HTML5

```jsx
import React from 'react';

const AudioPlayer = () => {
  return (
    <audio 
      controls 
      preload="metadata"
    >
      <source src="/assets/audio/podcasts/thoi-su-hang-ngay.mp3" type="audio/mpeg" />
      <source src="/assets/audio/podcasts/thoi-su-hang-ngay.ogg" type="audio/ogg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
```

### Tạo player tùy chỉnh

```jsx
import React, { useState, useRef } from 'react';

const CustomAudioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="custom-audio-player">
      <audio 
        ref={audioRef} 
        src="/assets/audio/podcasts/thoi-su-hang-ngay.mp3" 
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
      />
      <button onClick={togglePlayPause}>
        {isPlaying ? 'Tạm dừng' : 'Phát'}
      </button>
    </div>
  );
};

export default CustomAudioPlayer;
```

## Công cụ tối ưu hóa âm thanh

- [Audacity](https://www.audacityteam.org/) - Phần mềm chỉnh sửa âm thanh mã nguồn mở
- [FFmpeg](https://ffmpeg.org/) - Công cụ dòng lệnh để xử lý âm thanh
- [MP3Gain](http://mp3gain.sourceforge.net/) - Chuẩn hóa âm lượng của tệp MP3

## Quy trình thêm âm thanh mới

1. Chỉnh sửa và tối ưu hóa bằng công cụ phù hợp
2. Chuyển đổi sang định dạng phù hợp (MP3 và OGG để hỗ trợ đa trình duyệt)
3. Đặt tên theo quy tắc đã định
4. Thêm vào thư mục thích hợp dựa trên mục đích
5. Sử dụng thẻ `<audio>` với nhiều định dạng nguồn để đảm bảo tương thích tốt nhất 