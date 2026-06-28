import random
from PIL import Image, ImageDraw, ImageFilter
import math
import os

random.seed(42)

def pixelize(img, pixel_size=8):
    """将图片像素化"""
    w, h = img.size
    small = img.resize((w // pixel_size, h // pixel_size), Image.NEAREST)
    return small.resize((w, h), Image.NEAREST)

def noise_overlay(img, intensity=0.03):
    """添加像素噪点"""
    w, h = img.size
    pixels = img.load()
    for y in range(0, h, 4):
        for x in range(0, w, 4):
            if random.random() < 0.3:
                r, g, b = pixels[x, y][:3]
                n = random.randint(-20, 20)
                pixels[x, y] = (
                    max(0, min(255, r + n)),
                    max(0, min(255, g + n)),
                    max(0, min(255, b + n)),
                    255
                )
    return img

def draw_sky(draw, w, h, colors):
    """绘制像素化天空渐变"""
    for y in range(h):
        t = y / h
        r = int(colors[0][0] + (colors[1][0] - colors[0][0]) * t)
        g = int(colors[0][1] + (colors[1][1] - colors[0][1]) * t)
        b = int(colors[0][2] + (colors[1][2] - colors[0][2]) * t)
        # 每 4 像素一行，增强像素感
        if y % 4 == 0:
            draw.rectangle([0, y, w, y+4], fill=(r, g, b))

def draw_mountain_line(draw, w, base_y, peaks, color, pixel_size=8):
    """绘制像素化山脉轮廓"""
    points = [(0, base_y)]
    step = w // (len(peaks) + 1)
    for i, peak in enumerate(peaks):
        x = step * (i + 1) + random.randint(-30, 30)
        y = base_y - peak
        # 添加锯齿像素感
        points.append((x - pixel_size*2, base_y - peak//3))
        points.append((x, y))
        points.append((x + pixel_size*2, base_y - peak//3))
    points.append((w, base_y))
    points.append((w, base_y + 200))
    points.append((0, base_y + 200))
    
    # 用大块像素填充
    draw.polygon(points, fill=color)
    
    # 添加像素化边缘
    for i in range(len(points) - 1):
        x1, y1 = points[i]
        x2, y2 = points[i+1]
        if x2 > x1:
            for px in range(int(x1), int(x2), pixel_size):
                t = (px - x1) / (x2 - x1) if x2 != x1 else 0
                py = int(y1 + (y2 - y1) * t)
                py = (py // pixel_size) * pixel_size
                draw.rectangle([px, py, px + pixel_size, py + pixel_size], fill=color)

def draw_ground(draw, w, h, base_y, color_top, color_body, pixel_size=8):
    """绘制像素化地面"""
    # 地面主体
    draw.rectangle([0, base_y, w, h], fill=color_body)
    
    # 顶部像素块 - 不规则的像素边缘
    for x in range(0, w, pixel_size):
        offset = random.choice([0, pixel_size, pixel_size*2])
        draw.rectangle([x, base_y - offset, x + pixel_size, base_y], fill=color_top)
    
    # 地面纹理 - 像素块
    for _ in range(200):
        x = random.randint(0, w)
        y = random.randint(base_y + 20, h - 10)
        x = (x // pixel_size) * pixel_size
        y = (y // pixel_size) * pixel_size
        c = random.choice([color_top, color_body, tuple(max(0, c-20) for c in color_body)])
        draw.rectangle([x, y, x + pixel_size, y + pixel_size], fill=c)

def draw_pixel_tree(draw, x, y, trunk_color, leaf_color, size=40, pixel_size=8):
    """绘制像素树"""
    # 树干
    trunk_w = pixel_size * 2
    trunk_h = size // 2
    draw.rectangle([x - trunk_w//2, y - trunk_h, x + trunk_w//2, y], fill=trunk_color)
    
    # 树叶 - 多层像素圆
    for layer in range(3):
        r = size - layer * 10
        cy = y - trunk_h - layer * 8
        for px in range(x - r, x + r, pixel_size):
            for py in range(cy - r, cy + r, pixel_size):
                if (px - x)**2 + (py - cy)**2 < r**2:
                    c = leaf_color if random.random() > 0.1 else tuple(min(255, c+20) for c in leaf_color)
                    draw.rectangle([px, py, px + pixel_size, py + pixel_size], fill=c)

def draw_pixel_cactus(draw, x, y, color, size=30, pixel_size=8):
    """绘制像素仙人掌"""
    w = pixel_size * 2
    h = size
    # 主干
    draw.rectangle([x - w//2, y - h, x + w//2, y], fill=color)
    # 左臂
    draw.rectangle([x - w*2, y - h*0.6, x - w//2, y - h*0.6 + pixel_size*2], fill=color)
    draw.rectangle([x - w*2, y - h*0.8, x - w*2 + pixel_size*2, y - h*0.6], fill=color)
    # 右臂
    draw.rectangle([x + w//2, y - h*0.7, x + w*2, y - h*0.7 + pixel_size*2], fill=color)
    draw.rectangle([x + w*2 - pixel_size*2, y - h*0.9, x + w*2, y - h*0.7], fill=color)

def draw_pixel_star(draw, x, y, color, size=16, pixel_size=4):
    """绘制像素星星"""
    points = [
        (x, y - size), (x + pixel_size, y - pixel_size),
        (x + size, y), (x + pixel_size, y + pixel_size),
        (x, y + size), (x - pixel_size, y + pixel_size),
        (x - size, y), (x - pixel_size, y - pixel_size),
    ]
    draw.polygon(points, fill=color)

def draw_pixel_cloud(draw, x, y, color, size=60, pixel_size=8):
    """绘制像素云"""
    blocks = [
        (x - size, y, size*2, pixel_size*3),
        (x - size*0.7, y - pixel_size*2, size*1.4, pixel_size*3),
        (x - size*0.3, y - pixel_size*4, size*0.6, pixel_size*3),
    ]
    for bx, by, bw, bh in blocks:
        draw.rectangle([bx, by, bx + bw, by + bh], fill=color)

def draw_pixel_crystal(draw, x, y, color, size=30, pixel_size=8):
    """绘制像素水晶"""
    points = [
        (x, y - size),
        (x + size*0.5, y - size*0.3),
        (x + size*0.3, y),
        (x - size*0.3, y),
        (x - size*0.5, y - size*0.3),
    ]
    draw.polygon(points, fill=color)
    draw.polygon(points, fill=tuple(min(255, c+40) for c in color))

def draw_pixel_castle(draw, x, y, color, size=80, pixel_size=8):
    """绘制像素城堡"""
    # 主塔
    w = size
    h = size * 1.2
    draw.rectangle([x - w//2, y - h, x + w//2, y], fill=color)
    # 塔顶
    draw.polygon([
        (x - w//2 - pixel_size*2, y - h),
        (x + w//2 + pixel_size*2, y - h),
        (x, y - h - size*0.5)
    ], fill=(100, 100, 120))
    # 侧塔
    for sx in [x - w//2 - size*0.3, x + w//2 + size*0.1]:
        draw.rectangle([sx, y - h*0.7, sx + size*0.3, y], fill=(80, 80, 100))
        draw.polygon([
            (sx, y - h*0.7),
            (sx + size*0.3, y - h*0.7),
            (sx + size*0.15, y - h*0.9 - size*0.3)
        ], fill=(100, 100, 120))

def create_map_background(theme, width=1920, height=1080, pixel_size=8):
    """生成像素风地图背景"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    w, h = width, height
    
    if theme == 'grassland':
        # 青青草原
        sky_colors = [(135, 206, 235), (144, 238, 144)]  # sky blue -> light green
        draw_sky(draw, w, h, sky_colors)
        draw_mountain_line(draw, w, h*0.55, [80, 150, 100, 120], (34, 139, 34), pixel_size)
        draw_mountain_line(draw, w, h*0.65, [50, 80, 60], (50, 205, 50), pixel_size)
        draw_ground(draw, w, h, h*0.75, (34, 139, 34), (50, 205, 50), pixel_size)
        # 树
        for tx in range(100, w, 180):
            draw_pixel_tree(draw, tx + random.randint(-20, 20), int(h*0.78), 
                          (139, 69, 19), (34, 139, 34), 50, pixel_size)
        # 花
        for _ in range(30):
            fx = random.randint(0, w)
            fy = int(h*0.8 + random.randint(0, 100))
            fx = (fx // pixel_size) * pixel_size
            fy = (fy // pixel_size) * pixel_size
            draw.rectangle([fx, fy, fx + pixel_size, fy + pixel_size], fill=(255, 105, 180))
        # 云
        for cx in range(150, w, 300):
            draw_pixel_cloud(draw, cx, random.randint(50, 150), (255, 255, 255, 180), 50, pixel_size)
    
    elif theme == 'desert':
        # 炽热沙漠
        sky_colors = [(255, 200, 100), (255, 230, 180)]
        draw_sky(draw, w, h, sky_colors)
        # 太阳
        draw.rectangle([w*0.75, 60, w*0.75 + 80, 60 + 80], fill=(255, 140, 0))
        draw_mountain_line(draw, w, h*0.55, [100, 180, 120], (210, 180, 140), pixel_size)
        draw_ground(draw, w, h, h*0.72, (244, 164, 96), (210, 180, 140), pixel_size)
        # 沙丘纹理
        for _ in range(100):
            x = random.randint(0, w)
            y = int(h*0.72 + random.randint(0, 200))
            x = (x // pixel_size) * pixel_size
            y = (y // pixel_size) * pixel_size
            draw.rectangle([x, y, x + pixel_size*2, y + pixel_size], fill=(222, 184, 135))
        # 仙人掌
        for tx in range(150, w, 250):
            draw_pixel_cactus(draw, tx + random.randint(-30, 30), int(h*0.78), (85, 107, 47), 35, pixel_size)
        # 金字塔远景
        draw.polygon([(w*0.8, h*0.72), (w*0.85, h*0.55), (w*0.9, h*0.72)], fill=(210, 180, 140))
        draw.polygon([(w*0.87, h*0.72), (w*0.91, h*0.6), (w*0.95, h*0.72)], fill=(200, 170, 130))
    
    elif theme == 'forest':
        # 迷雾森林
        sky_colors = [(60, 100, 70), (100, 150, 120)]
        draw_sky(draw, w, h, sky_colors)
        draw_mountain_line(draw, w, h*0.5, [150, 200, 180, 160], (30, 80, 40), pixel_size)
        draw_mountain_line(draw, w, h*0.6, [100, 140, 120], (40, 100, 50), pixel_size)
        draw_ground(draw, w, h, h*0.75, (34, 85, 51), (40, 100, 60), pixel_size)
        # 高大树木
        for tx in range(80, w, 140):
            h_tree = random.randint(80, 120)
            draw_pixel_tree(draw, tx, int(h*0.8), (60, 40, 20), (20, 80, 30), h_tree, pixel_size)
        # 蘑菇
        for _ in range(15):
            mx = random.randint(0, w)
            my = int(h*0.82 + random.randint(0, 80))
            mx = (mx // pixel_size) * pixel_size
            my = (my // pixel_size) * pixel_size
            draw.rectangle([mx, my, mx + pixel_size, my + pixel_size*2], fill=(255, 255, 255))
            draw.rectangle([mx - pixel_size, my - pixel_size, mx + pixel_size*2, my], fill=(220, 50, 50))
        # 萤火虫
        for _ in range(40):
            fx = random.randint(0, w)
            fy = random.randint(int(h*0.4), int(h*0.7))
            draw.rectangle([fx, fy, fx + pixel_size, fy + pixel_size], fill=(255, 255, 100, 150))
    
    elif theme == 'snow':
        # 冰封雪山
        sky_colors = [(200, 220, 240), (240, 248, 255)]
        draw_sky(draw, w, h, sky_colors)
        # 极光效果
        for i in range(5):
            color = (100 + i*20, 200 + i*10, 150 + i*20)
            draw_mountain_line(draw, w, h*(0.3 + i*0.05), [random.randint(30, 60)], color, pixel_size*2)
        draw_mountain_line(draw, w, h*0.55, [200, 250, 180, 220], (100, 116, 139), pixel_size)
        draw_mountain_line(draw, w, h*0.65, [100, 150, 120], (130, 150, 170), pixel_size)
        draw_ground(draw, w, h, h*0.78, (200, 220, 240), (220, 230, 240), pixel_size)
        # 雪覆盖
        for _ in range(50):
            x = random.randint(0, w)
            y = int(h*0.55 + random.randint(0, 150))
            x = (x // pixel_size) * pixel_size
            y = (y // pixel_size) * pixel_size
            draw.rectangle([x, y, x + pixel_size*2, y + pixel_size], fill=(255, 255, 255))
        # 松树
        for tx in range(100, w, 200):
            draw_pixel_tree(draw, tx, int(h*0.82), (60, 50, 40), (20, 40, 60), 50, pixel_size)
    
    elif theme == 'volcano':
        # 熔岩火山
        sky_colors = [(40, 10, 10), (120, 30, 30)]
        draw_sky(draw, w, h, sky_colors)
        # 火山主体
        draw.polygon([(w*0.3, h*0.7), (w*0.5, h*0.25), (w*0.7, h*0.7)], fill=(60, 20, 20))
        # 岩浆顶部
        draw.polygon([(w*0.47, h*0.25), (w*0.5, h*0.18), (w*0.53, h*0.25)], fill=(255, 69, 0))
        # 流淌的岩浆
        for i in range(5):
            lx = w*0.5 + random.randint(-40, 40)
            ly = h*0.3 + i * 60
            draw.rectangle([lx, ly, lx + pixel_size*3, ly + pixel_size*4], fill=(255, 69, 0))
        draw_mountain_line(draw, w, h*0.65, [80, 120, 100], (50, 20, 20), pixel_size)
        draw_ground(draw, w, h, h*0.75, (40, 20, 20), (30, 15, 15), pixel_size)
        # 火焰粒子
        for _ in range(60):
            fx = random.randint(0, w)
            fy = random.randint(int(h*0.3), int(h*0.8))
            draw.rectangle([fx, fy, fx + pixel_size, fy + pixel_size], fill=(255, random.randint(50, 150), 0))
    
    elif theme == 'swamp':
        # 剧毒沼泽
        sky_colors = [(20, 40, 20), (40, 80, 40)]
        draw_sky(draw, w, h, sky_colors)
        draw_mountain_line(draw, w, h*0.55, [80, 140, 100], (30, 50, 30), pixel_size)
        draw_ground(draw, w, h, h*0.72, (50, 80, 50), (40, 70, 40), pixel_size)
        # 沼泽水洼
        for _ in range(20):
            cx = random.randint(100, w-100)
            cy = int(h*0.78 + random.randint(0, 80))
            r = random.randint(30, 60)
            draw.ellipse([cx - r, cy - r//2, cx + r, cy + r//2], fill=(60, 80, 60))
        # 枯树
        for tx in range(120, w, 220):
            draw.rectangle([tx, int(h*0.55), tx + pixel_size*2, int(h*0.82)], fill=(40, 30, 20))
            # 枯枝
            draw.rectangle([tx - 15, int(h*0.65), tx, int(h*0.65) + pixel_size], fill=(40, 30, 20))
            draw.rectangle([tx + pixel_size*2, int(h*0.6), tx + pixel_size*2 + 15, int(h*0.6) + pixel_size], fill=(40, 30, 20))
        # 荧光蘑菇
        for _ in range(25):
            mx = random.randint(0, w)
            my = int(h*0.8 + random.randint(0, 80))
            mx = (mx // pixel_size) * pixel_size
            my = (my // pixel_size) * pixel_size
            draw.rectangle([mx, my + pixel_size, mx + pixel_size, my + pixel_size*3], fill=(255, 255, 255, 100))
            draw.rectangle([mx - pixel_size, my, mx + pixel_size*2, my + pixel_size], fill=(150, 255, 50))
        # 毒雾
        for _ in range(50):
            x = random.randint(0, w)
            y = random.randint(int(h*0.5), int(h*0.8))
            draw.rectangle([x, y, x + pixel_size*2, y + pixel_size*2], fill=(100, 200, 50, 80))
    
    elif theme == 'abyss':
        # 幽暗深渊
        sky_colors = [(10, 5, 30), (30, 10, 60)]
        draw_sky(draw, w, h, sky_colors)
        # 水晶
        for cx in range(150, w, 200):
            draw_pixel_crystal(draw, cx, int(h*0.75), (138, 43, 226), 40, pixel_size)
            draw_pixel_crystal(draw, cx + 80, int(h*0.8), (100, 200, 255), 25, pixel_size)
        draw_ground(draw, w, h, h*0.78, (20, 10, 40), (15, 5, 30), pixel_size)
        # 紫色发光矿石
        for _ in range(40):
            x = random.randint(0, w)
            y = int(h*0.6 + random.randint(0, 200))
            x = (x // pixel_size) * pixel_size
            y = (y // pixel_size) * pixel_size
            draw.rectangle([x, y, x + pixel_size, y + pixel_size], fill=(147, 50, 255))
        # 蝙蝠剪影
        for _ in range(15):
            bx = random.randint(0, w)
            by = random.randint(int(h*0.2), int(h*0.5))
            draw.rectangle([bx, by, bx + pixel_size*3, by + pixel_size], fill=(0, 0, 0))
            draw.rectangle([bx + pixel_size*3, by - pixel_size, bx + pixel_size*4, by], fill=(0, 0, 0))
            draw.rectangle([bx - pixel_size, by - pixel_size, bx, by], fill=(0, 0, 0))
    
    elif theme == 'castle':
        # 星河城堡
        sky_colors = [(5, 5, 40), (20, 10, 60)]
        draw_sky(draw, w, h, sky_colors)
        # 星星
        for _ in range(150):
            sx = random.randint(0, w)
            sy = random.randint(0, int(h*0.5))
            size = random.choice([pixel_size, pixel_size, pixel_size*2])
            draw.rectangle([sx, sy, sx + size, sy + size], fill=(255, 255, 200))
        # 银河
        for i in range(100):
            x = w*0.3 + i*8 + random.randint(-20, 20)
            y = h*0.1 + i*3 + random.randint(-10, 10)
            draw.rectangle([x, y, x + pixel_size*2, y + pixel_size], fill=(200, 180, 255, 150))
        # 城堡
        draw_pixel_castle(draw, w*0.5, int(h*0.82), (60, 60, 100), 100, pixel_size)
        # 小城堡
        draw_pixel_castle(draw, w*0.2, int(h*0.85), (50, 50, 80), 60, pixel_size)
        draw_pixel_castle(draw, w*0.8, int(h*0.85), (50, 50, 80), 60, pixel_size)
        draw_ground(draw, w, h, h*0.82, (30, 30, 60), (20, 20, 50), pixel_size)
        # 月亮
        draw.ellipse([w*0.1, 40, w*0.1 + 80, 120], fill=(240, 240, 220))
    
    # 统一像素化
    img = pixelize(img, pixel_size=4)
    img = noise_overlay(img)
    
    return img

def main():
    output_dir = 'client/public/maps'
    os.makedirs(output_dir, exist_ok=True)
    
    themes = [
        ('grassland', 'map-level-1'),
        ('desert', 'map-level-2'),
        ('forest', 'map-level-3'),
        ('snow', 'map-level-4'),
        ('volcano', 'map-level-5'),
        ('swamp', 'map-level-6'),
        ('abyss', 'map-level-7'),
        ('castle', 'map-level-8'),
    ]
    
    for theme, filename in themes:
        print(f'Generating {filename} ({theme})...')
        img = create_map_background(theme, width=1920, height=1080, pixel_size=8)
        img.save(os.path.join(output_dir, f'{filename}.png'), 'PNG')
        print(f'  Saved {filename}.png')
    
    print('Done! All 8 map backgrounds generated.')
    return output_dir

if __name__ == '__main__':
    main()
