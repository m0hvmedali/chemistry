import subprocess

# لينك الفيديو m3u8
url = "https://vz-d7be94b9-b00.b-cdn.net/af04d01b-0534-40fe-8bf7-a0a560cac653/playlist.m3u8"

# اسم الملف اللي هيتحفظ
output_file = "video.mp4"

# أمر ffmpeg لتحميل الفيديو
command = [
    "ffmpeg",
    "-i", url,
    "-c", "copy",   # نسخ الفيديو بدون إعادة ترميز (سرعة وجودة أصلية)
    "-bsf:a", "aac_adtstoasc",
    output_file
]

# تنفيذ الأمر
try:
    subprocess.run(command, check=True)
    print(f"تم التحميل بنجاح → {output_file}")
except subprocess.CalledProcessError as e:
    print("حصل خطأ أثناء التحميل:", e)
