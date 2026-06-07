export interface TestUser {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

export const testUser: TestUser = {
  id: "123456789",
  name: "nishan",
  email: "dreamgf691@gmail.com",
  username: "Tester",
  phone: "+12025550123",
  avatarUrl: "https://example.com/avatar.png",
  isActive: true,
};
