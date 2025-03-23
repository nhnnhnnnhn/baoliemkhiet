# Hướng dẫn quản lý video

Thư mục này chứa tất cả các video được sử dụng trong ứng dụng Báo Liêm Khiết. Để duy trì tính nhất quán và hiệu suất tốt, vui lòng tuân thủ cấu trúc và quy tắc sau đây.

## Cấu trúc thư mục

- `/news/` - Video cho các bài báo tin tức chung
- `/sport/` - Video liên quan đến thể thao
- `/interviews/` - Video phỏng vấn và trao đổi

## Quy tắc đặt tên

1. Sử dụng chữ thường và dấu gạch ngang để ngăn cách các từ (ví dụ: `phong-van-thu-tuong.mp4`)
2. Bắt đầu tên file với chủ đề hoặc mục đích (ví dụ: `sport-world-cup-2022-highlight.mp4`)
3. Thêm ngày tháng vào cuối tên nếu nội dung liên quan đến thời gian cụ thể (ví dụ: `news-hoi-nghi-trung-uong-2023-05-20.mp4`)

## Yêu cầu về định dạng và kích thước

### Định dạng
- **MP4 với codec H.264**: Định dạng chính để đảm bảo tương thích trên các trình duyệt
- **WebM**: Có thể sử dụng như định dạng thay thế cho các trình duyệt hiện đại

### Độ phân giải
- **Tiêu chuẩn**: 1080p (1920x1080) hoặc 720p (1280x720)
- **Tỷ lệ khung hình**: 16:9

### Bitrate và dung lượng
- **Bitrate khuyến nghị**: 2-5 Mbps cho 1080p, 1-3 Mbps cho 720p
- **Dung lượng tối đa**: 
  - Video ngắn (dưới 1 phút): 10MB
  - Video vừa (1-5 phút): 30MB
  - Video dài (trên 5 phút): Xem xét sử dụng nền tảng nhúng bên ngoài như YouTube

### Âm thanh
- **Codec**: AAC
- **Bitrate**: 128-192 Kbps
- **Kênh**: Stereo hoặc Mono

## Hướng dẫn nhúng video

### Sử dụng thẻ video HTML5

```jsx
import React from 'react';

const VideoPlayer = () => {
  return (
    <video 
      width="800" 
      height="450" 
      controls 
      preload="metadata"
      poster="/path/to/thumbnail.jpg"
    >
      <source src="/assets/videos/news/tin-tuc-moi-nhat.mp4" type="video/mp4" />
      <source src="/assets/videos/news/tin-tuc-moi-nhat.webm" type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
```

### Sử dụng nền tảng bên ngoài

Đối với video dài hoặc cần tối ưu băng thông, hãy xem xét nhúng từ nền tảng bên ngoài:

```jsx
const YouTubeEmbed = () => {
  return (
    <iframe 
      width="800" 
      height="450" 
      src="https://www.youtube.com/embed/VIDEO_ID" 
      title="Video Title"
      frameBorder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen
    ></iframe>
  );
};
```

## Công cụ tối ưu hóa video

- [Handbrake](https://handbrake.fr/) - Công cụ mã hóa video mã nguồn mở
- [FFmpeg](https://ffmpeg.org/) - Công cụ dòng lệnh để xử lý video và âm thanh
- [VLC Media Player](https://www.videolan.org/) - Có thể dùng để chuyển đổi định dạng video

## Quy trình thêm video mới

1. Tối ưu hóa video bằng công cụ phù hợp để đạt được kích thước file hợp lý
2. Đặt tên theo quy tắc đã định
3. Thêm vào thư mục thích hợp dựa trên nội dung
4. Xem xét tạo thumbnail cho video
5. Sử dụng thẻ `<video>` với nhiều định dạng nguồn để đảm bảo tương thích với nhiều trình duyệt 