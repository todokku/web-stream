ffmpeg -i background.mp4 -i allisfine.jpeg -filter_complex "\
[0][1]overlay=x=W-1720-40*(t-11):shortest:y=((t-0.9)*60-h)[sparda]; \
[sparda][1]overlay='W-1380:(n*2-h)'[dante]; \
[dante][1]overlay='W-580+.1*n:(n*1.5-h)'[rebellion]; \
[rebellion][1]overlay='W-960:(n*2-h)'[a]; \
[a][1]overlay='W-1720:(n*1.5-h-600)'[b]; \
[b][1]overlay='W-1380:(n*2-h-600)'[c]; \
[c][1]overlay='W-580:(n*1.5-h-600)'[d]; \
[d][1]overlay='W-960:(n*2-h-600)' \
" -c:v libx264 output.mp4 -y

# ffmpeg -y \
# -loop 1 -i background.jpg -ss 0 -t 10 \
# -filter_complex " \
# [0]scale=w=-2:h=4*1080, \
# crop=w=1920/.5:h=1080/.5:y=(in_h-out_h)-t*(in_h-out_h)/10, \
# scale=w=1920:h=1080,  setsar=1 \
# " -c:v h264 -crf 18 loop-back.mp4

# ffmpeg -i loop-back.mp4 -filter_complex loop=loop=3:size=75:start=0 looped.mp4