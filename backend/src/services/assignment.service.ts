import { assignmentRepository } from "../repositories/assignment.repository.js";

export class AssignmentService {
  async getAllAssignments(filters?: { malh?: number; search?: string }) {
    return assignmentRepository.getAll(filters);
  }

  async getAssignmentsByClass(malh: number) {
    return assignmentRepository.getAssignmentsByClass(malh);
  }

  async getAssignmentById(mabt: number) {
    return assignmentRepository.findById(mabt);
  }

  async createAssignment(data: { malh: number; loai?: string; noiDung?: string; deadline?: Date }) {
    return assignmentRepository.create(data);
  }

  async updateAssignment(mabt: number, data: any) {
    return assignmentRepository.update(mabt, data);
  }

  async deleteAssignment(mabt: number) {
    return assignmentRepository.delete(mabt);
  }

  async toggleStatus(mabt: number) {
    return assignmentRepository.toggleStatus(mabt);
  }

  async getGroups(mabt: number) {
    return assignmentRepository.getGroupsByAssignment(mabt);
  }

  async getGroupById(manhom: number) {
    return assignmentRepository.getGroupById(manhom);
  }

  async createGroup(data: { mabt: number; deTai?: string }) {
    return assignmentRepository.createGroup(data);
  }

  async updateGroup(manhom: number, data: { deTai?: string }) {
    return assignmentRepository.updateGroup(manhom, data);
  }

  async deleteGroup(manhom: number) {
    return assignmentRepository.deleteGroup(manhom);
  }

  async getGroupMembers(manhom: number) {
    return assignmentRepository.getGroupMembers(manhom);
  }

  async addMember(manhom: number, masv: number) {
    return assignmentRepository.addMemberToGroup(manhom, masv);
  }

  async removeMember(manhom: number, masv: number) {
    return assignmentRepository.removeMemberFromGroup(manhom, masv);
  }
}

export const assignmentService = new AssignmentService();

