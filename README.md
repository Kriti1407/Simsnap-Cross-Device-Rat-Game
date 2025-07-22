# SimSnap - Cross-Device Interactive Platform
[Watch Demo](https://drive.google.com/file/d/1uBGQtmsfLXRlMcZiaRkyMokZt_BOvPc7/view?pli=1) &#x1F680;
## Overview

**SimSnap** is a cross-device interactive platform developed as part of my **BTech final-year project**. It enhances user experience in **gaming** and **learning applications** by combining:

- 🌐 Dynamic cross-device interaction  
- 🧩 Spatial rearrangement of devices

Multiple devices (like Chromebooks) can connect and collaborate, forming a **unified, interactive game environment**.

![IMG_20250722_21521144](https://github.com/user-attachments/assets/e2650ea1-2c0b-419c-a459-99039b5e8ef7)


---

## Problem Statement ❓

While mobile and smart devices are widely used, existing collaborative systems often focus on:

- ✅ Complex device arrangements but with **simple interactions**, or  
- ✅ Complex interactions without supporting **spatial device layout**

**SimSnap bridges this gap** by supporting both:

> 🔁 Real-time dynamic interaction  
> 📐 Spatial rearrangement of multiple devices

---

## Key Features

### 🔗 Snapping & Unsnapping

- Devices can be **connected (snapped)** to create a larger display  
- Devices can be **disconnected (unsnapped)** dynamically without interrupting gameplay

### 🎮 Game Mechanics: *"Rat Game"*

- Player controls a **rat** that moves **up/down/left/right** across connected devices  
- The rat **seamlessly transitions** from one device to another  
- ⚠️ Obstacles block paths  
- 🍎 Fruits = Points or level progression

<img width="1044" height="649" alt="Screenshot 2025-07-22 at 9 58 39 PM" src="https://github.com/user-attachments/assets/faee2d6a-ef22-4a05-90f6-7fe332e2b4e1" />


---

## 🛠 Technical Implementation

- **Frontend:** `React.js` for user interface & device interaction  
- **Backend:** `Express.js` for server communication & device state management  
- **Real-Time Sync:** `WebSocket` for syncing game state across devices with zero lag

---

## 🧠 Challenges & Solutions

| Challenge | Solution |
|----------|----------|
| **Device Synchronization** | Used **WebSocket** to ensure real-time synced movement |
| **Dynamic Interaction** | Implemented **responsive grid reconfiguration** to adapt instantly when devices are snapped/unsnapped |

---

## 📚 Learning Outcomes

This project helped me gain practical experience in:

- Cross-device interaction design  
- Real-time communication between multiple clients  
- Human-Computer Interaction (HCI) principles  
- Creating scalable and adaptive UI/UX for multiple screens

---

## ✅ Conclusion

**SimSnap** showcases how **collaborative, multi-device systems** can lead to powerful interactive experiences.  
It combines **technical innovation** and **creative gameplay**, making it a valuable contribution to the field of cross-device interaction.

---

## 🚀 Getting Started

To run the project locally:

```bash
# Clone the repository
git clone https://github.com/your-username/simsnap.git
cd simsnap

# Install dependencies
npm install

# Start development server
npm start

```
## Contributing
We welcome contributions from the community. Feel free to open issues, submit pull requests, or suggest new features.

## License
Copyright 2025. Code released under the [MIT license](https://github.com/Shape-Up-NZ/shape-up-app/blob/main/LICENSE).
