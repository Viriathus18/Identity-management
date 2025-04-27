from flask import Flask, jsonify
import cv2
import face_recognition
from PIL import Image
import numpy as np
import sys
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React (localhost:3000) to access Flask (localhost:5000)

def scan_face():
    # --- Step 1: Load and convert your reference image ---
    image_path = 'img.jpg'  # Make sure this image exists

    try:
        pil_image = Image.open(image_path).convert('RGB')
        reference_image = np.array(pil_image)
        print(f"✅ Loaded and converted image: {image_path}")
    except FileNotFoundError:
        print("❌ Image not found. Check the file name and path.")
        return False
    except Exception as e:
        print(f"❌ Failed to load image: {e}")
        return False

    # --- Step 2: Generate face encoding from image ---
    try:
        known_encodings = face_recognition.face_encodings(reference_image)
        if not known_encodings:
            print("⚠️ No face detected in the reference image.")
            return False
        known_face_encoding = known_encodings[0]
        print("✅ Face encoding generated from reference image.")
    except Exception as e:
        print(f"❌ Error during face encoding: {e}")
        return False

    # --- Step 3: Initialize webcam ---
    video_capture = cv2.VideoCapture(0)
    if not video_capture.isOpened():
        print("❌ Could not access the webcam.")
        return False

    print("⌛ Starting webcam...")

    face_matched = False
    frame_count = 0
    start_time = time.time()

    # --- Scanning Animation Variables ---
    scan_line_y = 0
    scan_direction = 1
    scan_speed = 5

    # --- Main loop ---
    while True:
        ret, frame = video_capture.read()
        if not ret:
            print("❌ Failed to read from camera.")
            break

        elapsed_time = time.time() - start_time
        frame_count += 1

        small_frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
        rgb_small_frame = small_frame[:, :, ::-1]

        face_locations = []
        face_encodings = []

        if frame_count % 5 == 0:
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
            print(f"Detected {len(face_locations)} face(s).")

        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            match = face_recognition.compare_faces([known_face_encoding], face_encoding)[0]

            top *= 2
            right *= 2
            bottom *= 2
            left *= 2

            if match:
                color = (0, 255, 0)
                print("✅ Face matched!")
                face_matched = True
            else:
                color = (255, 0, 0)
                print("❎ Face not matched!")

            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)

        # --- Draw scanning line ---
        if not face_matched:
            scan_color = (0, 0, 255)
            thickness = 2
            cv2.line(frame, (0, scan_line_y), (frame.shape[1], scan_line_y), scan_color, thickness)

            scan_line_y += scan_direction * scan_speed
            if scan_line_y >= frame.shape[0] or scan_line_y <= 0:
                scan_direction *= -1

            cv2.putText(frame, "SCANNING...", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        else:
            cv2.putText(frame, "MATCHED!", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        cv2.imshow("Face Recognition with Scanning Animation", frame)

        key = cv2.waitKey(1) & 0xFF

        if (face_matched and elapsed_time >= 6) or key == ord('q'):
            print("✅ Closing camera after match and 6 seconds.")
            break

    # --- Cleanup ---
    video_capture.release()
    cv2.destroyAllWindows()
    print("✅ Camera closed.")
    
    return face_matched

# === Flask route ===
@app.route('/scan-face', methods=['POST'])
def scan_face_api():
    success = scan_face()
    if success:
        return jsonify({"message": "Face scan successful!"})
    else:
        return jsonify({"error": "Face scan failed!"}), 400

if __name__ == '__main__':
    app.run(port=5000)
