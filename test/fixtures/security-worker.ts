import worker from '../../apps/worker/src/index';
import { CourseRoom } from '../../apps/worker/src/room';
export { TrafficQuota } from '../../apps/worker/src/room';

// 仅供独立测试配置调用持久闹钟逻辑，正式Worker不导出此测试类。
export class SecurityTestRoom extends CourseRoom {
  async runAlarmForTest(): Promise<void> {
    await this.alarm();
  }
}

export default worker;
