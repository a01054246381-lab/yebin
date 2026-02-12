from flask import Flask, Response
import cv2
import torch
import sys
from pathlib import Path
import time
from datetime import datetime

# ===============================
# 캡쳐 설정
# ===============================
CAPTURE_INTERVAL = 5  # 초
LAST_CAPTURE_TIME = 0
CAPTURE_DIR = Path.cwd() / "captures"
CAPTURE_DIR.mkdir(exist_ok=True)  # captures 폴더 자동 생성
capture_enabled = True  # 자동 캡쳐 ON

# ===============================
# YOLOv5-face 경로
# ===============================
YOLO_FACE_DIR = Path("D:/py2025yebin/interview001/yolov5-face")
sys.path.append(str(YOLO_FACE_DIR))

from models.experimental import attempt_load
from utils.general import non_max_suppression_face, scale_coords
from utils.torch_utils import select_device

# ===============================
# Flask
# ===============================
app = Flask(__name__)

# ===============================
# 모델 로드
# ===============================
device = select_device("cpu")
model = attempt_load(
    YOLO_FACE_DIR / "yolov5s-face.pt",
    map_location=device
)
model.eval()

# ===============================
# 웹캠
# ===============================
cap = cv2.VideoCapture(0)

# ===============================
# 프레임 생성 함수
# ===============================
def generate_frames():
    global LAST_CAPTURE_TIME

    while True:
        success, frame = cap.read()
        if not success:
            break

        # YOLO 얼굴 감지
        img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (640, 640))
        img = torch.from_numpy(img).permute(2, 0, 1).float() / 255.0
        img = img.unsqueeze(0).to(device)

        with torch.no_grad():
            pred = model(img)[0]
            pred = non_max_suppression_face(pred, 0.4, 0.5)[0]

        if pred is not None and len(pred):
            pred[:, :4] = scale_coords(img.shape[2:], pred[:, :4], frame.shape).round()
            for det in pred:
                x1, y1, x2, y2 = map(int, det[:4])
                conf = float(det[4])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f"Face {conf:.2f}", (x1, y1 - 8),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        # ===============================
        # 5초마다 자동 저장
        # ===============================
        now = time.time()
        if capture_enabled and now - LAST_CAPTURE_TIME >= CAPTURE_INTERVAL:
            filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".jpg"
            save_path = CAPTURE_DIR / filename
            cv2.imwrite(str(save_path), frame)
            print(f"✅ 저장됨: {save_path}")
            LAST_CAPTURE_TIME = now

        # ===============================
        # MJPEG 스트리밍
        # ===============================
        ret, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()
        yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")

# ===============================
# Routes
# ===============================
@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )

@app.route("/")
def index():
    return "YOLOv5-face Flask Server Running"

# ===============================
# Run
# ===============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
