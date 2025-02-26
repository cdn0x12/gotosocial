//
// Copyright 2024 CloudWeGo Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

// Code generated by "mkasm_amd64.py", DO NOT EDIT.

package x86_64

// ADDQ performs "Add".
//
// Mnemonic        : ADD
// Supported forms : (8 forms)
//
//   - ADDQ imm32, rax
//   - ADDQ imm8, r64
//   - ADDQ imm32, r64
//   - ADDQ r64, r64
//   - ADDQ m64, r64
//   - ADDQ imm8, m64
//   - ADDQ imm32, m64
//   - ADDQ r64, m64
func (self *Program) ADDQ(v0 interface{}, v1 interface{}) *Instruction {
	p := self.alloc("ADDQ", 2, Operands{v0, v1})
	// ADDQ imm32, rax
	if isImm32(v0) && v1 == RAX {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48)
			m.emit(0x05)
			m.imm4(toImmAny(v[0]))
		})
	}
	// ADDQ imm8, r64
	if isImm8Ext(v0, 8) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1]))
			m.emit(0x83)
			m.emit(0xc0 | lcode(v[1]))
			m.imm1(toImmAny(v[0]))
		})
	}
	// ADDQ imm32, r64
	if isImm32Ext(v0, 8) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1]))
			m.emit(0x81)
			m.emit(0xc0 | lcode(v[1]))
			m.imm4(toImmAny(v[0]))
		})
	}
	// ADDQ r64, r64
	if isReg64(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[0])<<2 | hcode(v[1]))
			m.emit(0x01)
			m.emit(0xc0 | lcode(v[0])<<3 | lcode(v[1]))
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1])<<2 | hcode(v[0]))
			m.emit(0x03)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
	}
	// ADDQ m64, r64
	if isM64(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[1]), addr(v[0]))
			m.emit(0x03)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
	}
	// ADDQ imm8, m64
	if isImm8Ext(v0, 8) && isM64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, 0, addr(v[1]))
			m.emit(0x83)
			m.mrsd(0, addr(v[1]), 1)
			m.imm1(toImmAny(v[0]))
		})
	}
	// ADDQ imm32, m64
	if isImm32Ext(v0, 8) && isM64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, 0, addr(v[1]))
			m.emit(0x81)
			m.mrsd(0, addr(v[1]), 1)
			m.imm4(toImmAny(v[0]))
		})
	}
	// ADDQ r64, m64
	if isReg64(v0) && isM64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[0]), addr(v[1]))
			m.emit(0x01)
			m.mrsd(lcode(v[0]), addr(v[1]), 1)
		})
	}
	if p.len == 0 {
		panic("invalid operands for ADDQ")
	}
	return p
}

// CALLQ performs "Call Procedure".
//
// Mnemonic        : CALL
// Supported forms : (2 forms)
//
//   - CALLQ r64
//   - CALLQ m64
func (self *Program) CALLQ(v0 interface{}) *Instruction {
	p := self.alloc("CALLQ", 1, Operands{v0})
	// CALLQ r64
	if isReg64(v0) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexo(0, v[0], false)
			m.emit(0xff)
			m.emit(0xd0 | lcode(v[0]))
		})
	}
	// CALLQ m64
	if isM64(v0) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexo(0, addr(v[0]), false)
			m.emit(0xff)
			m.mrsd(2, addr(v[0]), 1)
		})
	}
	if p.len == 0 {
		panic("invalid operands for CALLQ")
	}
	return p
}

// CMPQ performs "Compare Two Operands".
//
// Mnemonic        : CMP
// Supported forms : (8 forms)
//
//   - CMPQ imm32, rax
//   - CMPQ imm8, r64
//   - CMPQ imm32, r64
//   - CMPQ r64, r64
//   - CMPQ m64, r64
//   - CMPQ imm8, m64
//   - CMPQ imm32, m64
//   - CMPQ r64, m64
func (self *Program) CMPQ(v0 interface{}, v1 interface{}) *Instruction {
	p := self.alloc("CMPQ", 2, Operands{v0, v1})
	// CMPQ imm32, rax
	if isImm32(v0) && v1 == RAX {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48)
			m.emit(0x3d)
			m.imm4(toImmAny(v[0]))
		})
	}
	// CMPQ imm8, r64
	if isImm8Ext(v0, 8) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1]))
			m.emit(0x83)
			m.emit(0xf8 | lcode(v[1]))
			m.imm1(toImmAny(v[0]))
		})
	}
	// CMPQ imm32, r64
	if isImm32Ext(v0, 8) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1]))
			m.emit(0x81)
			m.emit(0xf8 | lcode(v[1]))
			m.imm4(toImmAny(v[0]))
		})
	}
	// CMPQ r64, r64
	if isReg64(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[0])<<2 | hcode(v[1]))
			m.emit(0x39)
			m.emit(0xc0 | lcode(v[0])<<3 | lcode(v[1]))
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1])<<2 | hcode(v[0]))
			m.emit(0x3b)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
	}
	// CMPQ m64, r64
	if isM64(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[1]), addr(v[0]))
			m.emit(0x3b)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
	}
	// CMPQ imm8, m64
	if isImm8Ext(v0, 8) && isM64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, 0, addr(v[1]))
			m.emit(0x83)
			m.mrsd(7, addr(v[1]), 1)
			m.imm1(toImmAny(v[0]))
		})
	}
	// CMPQ imm32, m64
	if isImm32Ext(v0, 8) && isM64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, 0, addr(v[1]))
			m.emit(0x81)
			m.mrsd(7, addr(v[1]), 1)
			m.imm4(toImmAny(v[0]))
		})
	}
	// CMPQ r64, m64
	if isReg64(v0) && isM64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[0]), addr(v[1]))
			m.emit(0x39)
			m.mrsd(lcode(v[0]), addr(v[1]), 1)
		})
	}
	if p.len == 0 {
		panic("invalid operands for CMPQ")
	}
	return p
}

// JBE performs "Jump if below or equal (CF == 1 or ZF == 1)".
//
// Mnemonic        : JBE
// Supported forms : (2 forms)
//
//   - JBE rel8
//   - JBE rel32
func (self *Program) JBE(v0 interface{}) *Instruction {
	p := self.alloc("JBE", 1, Operands{v0})
	p.branch = _B_conditional
	// JBE rel8
	if isRel8(v0) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x76)
			m.imm1(relv(v[0]))
		})
	}
	// JBE rel32
	if isRel32(v0) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x0f)
			m.emit(0x86)
			m.imm4(relv(v[0]))
		})
	}
	// JBE label
	if isLabel(v0) {
		p.add(_F_rel1, func(m *_Encoding, v []interface{}) {
			m.emit(0x76)
			m.imm1(relv(v[0]))
		})
		p.add(_F_rel4, func(m *_Encoding, v []interface{}) {
			m.emit(0x0f)
			m.emit(0x86)
			m.imm4(relv(v[0]))
		})
	}
	if p.len == 0 {
		panic("invalid operands for JBE")
	}
	return p
}

// JMP performs "Jump Unconditionally".
//
// Mnemonic        : JMP
// Supported forms : (2 forms)
//
//   - JMP rel8
//   - JMP rel32
func (self *Program) JMP(v0 interface{}) *Instruction {
	p := self.alloc("JMP", 1, Operands{v0})
	p.branch = _B_unconditional
	// JMP rel8
	if isRel8(v0) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xeb)
			m.imm1(relv(v[0]))
		})
	}
	// JMP rel32
	if isRel32(v0) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xe9)
			m.imm4(relv(v[0]))
		})
	}
	// JMP label
	if isLabel(v0) {
		p.add(_F_rel1, func(m *_Encoding, v []interface{}) {
			m.emit(0xeb)
			m.imm1(relv(v[0]))
		})
		p.add(_F_rel4, func(m *_Encoding, v []interface{}) {
			m.emit(0xe9)
			m.imm4(relv(v[0]))
		})
	}
	if p.len == 0 {
		panic("invalid operands for JMP")
	}
	return p
}

// JMPQ performs "Jump Unconditionally".
//
// Mnemonic        : JMP
// Supported forms : (2 forms)
//
//   - JMPQ r64
//   - JMPQ m64
func (self *Program) JMPQ(v0 interface{}) *Instruction {
	p := self.alloc("JMPQ", 1, Operands{v0})
	// JMPQ r64
	if isReg64(v0) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexo(0, v[0], false)
			m.emit(0xff)
			m.emit(0xe0 | lcode(v[0]))
		})
	}
	// JMPQ m64
	if isM64(v0) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexo(0, addr(v[0]), false)
			m.emit(0xff)
			m.mrsd(4, addr(v[0]), 1)
		})
	}
	if p.len == 0 {
		panic("invalid operands for JMPQ")
	}
	return p
}

// LEAQ performs "Load Effective Address".
//
// Mnemonic        : LEA
// Supported forms : (1 form)
//
//   - LEAQ m, r64
func (self *Program) LEAQ(v0 interface{}, v1 interface{}) *Instruction {
	p := self.alloc("LEAQ", 2, Operands{v0, v1})
	// LEAQ m, r64
	if isM(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[1]), addr(v[0]))
			m.emit(0x8d)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
	}
	if p.len == 0 {
		panic("invalid operands for LEAQ")
	}
	return p
}

// MOVQ performs "Move".
//
// Mnemonic        : MOV
// Supported forms : (16 forms)
//
//   - MOVQ imm32, r64
//   - MOVQ imm64, r64
//   - MOVQ r64, r64
//   - MOVQ m64, r64
//   - MOVQ imm32, m64
//   - MOVQ r64, m64
//   - MOVQ mm, r64       [MMX]
//   - MOVQ r64, mm       [MMX]
//   - MOVQ mm, mm        [MMX]
//   - MOVQ m64, mm       [MMX]
//   - MOVQ mm, m64       [MMX]
//   - MOVQ xmm, r64      [SSE2]
//   - MOVQ r64, xmm      [SSE2]
//   - MOVQ xmm, xmm      [SSE2]
//   - MOVQ m64, xmm      [SSE2]
//   - MOVQ xmm, m64      [SSE2]
func (self *Program) MOVQ(v0 interface{}, v1 interface{}) *Instruction {
	p := self.alloc("MOVQ", 2, Operands{v0, v1})
	// MOVQ imm32, r64
	if isImm32Ext(v0, 8) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1]))
			m.emit(0xc7)
			m.emit(0xc0 | lcode(v[1]))
			m.imm4(toImmAny(v[0]))
		})
	}
	// MOVQ imm64, r64
	if isImm64(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1]))
			m.emit(0xb8 | lcode(v[1]))
			m.imm8(toImmAny(v[0]))
		})
	}
	// MOVQ r64, r64
	if isReg64(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[0])<<2 | hcode(v[1]))
			m.emit(0x89)
			m.emit(0xc0 | lcode(v[0])<<3 | lcode(v[1]))
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1])<<2 | hcode(v[0]))
			m.emit(0x8b)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
	}
	// MOVQ m64, r64
	if isM64(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[1]), addr(v[0]))
			m.emit(0x8b)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
	}
	// MOVQ imm32, m64
	if isImm32Ext(v0, 8) && isM64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, 0, addr(v[1]))
			m.emit(0xc7)
			m.mrsd(0, addr(v[1]), 1)
			m.imm4(toImmAny(v[0]))
		})
	}
	// MOVQ r64, m64
	if isReg64(v0) && isM64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[0]), addr(v[1]))
			m.emit(0x89)
			m.mrsd(lcode(v[0]), addr(v[1]), 1)
		})
	}
	// MOVQ mm, r64
	if isMM(v0) && isReg64(v1) {
		self.require(ISA_MMX)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[0])<<2 | hcode(v[1]))
			m.emit(0x0f)
			m.emit(0x7e)
			m.emit(0xc0 | lcode(v[0])<<3 | lcode(v[1]))
		})
	}
	// MOVQ r64, mm
	if isReg64(v0) && isMM(v1) {
		self.require(ISA_MMX)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1])<<2 | hcode(v[0]))
			m.emit(0x0f)
			m.emit(0x6e)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
	}
	// MOVQ mm, mm
	if isMM(v0) && isMM(v1) {
		self.require(ISA_MMX)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexo(hcode(v[1]), v[0], false)
			m.emit(0x0f)
			m.emit(0x6f)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexo(hcode(v[0]), v[1], false)
			m.emit(0x0f)
			m.emit(0x7f)
			m.emit(0xc0 | lcode(v[0])<<3 | lcode(v[1]))
		})
	}
	// MOVQ m64, mm
	if isM64(v0) && isMM(v1) {
		self.require(ISA_MMX)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexo(hcode(v[1]), addr(v[0]), false)
			m.emit(0x0f)
			m.emit(0x6f)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[1]), addr(v[0]))
			m.emit(0x0f)
			m.emit(0x6e)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
	}
	// MOVQ mm, m64
	if isMM(v0) && isM64(v1) {
		self.require(ISA_MMX)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexo(hcode(v[0]), addr(v[1]), false)
			m.emit(0x0f)
			m.emit(0x7f)
			m.mrsd(lcode(v[0]), addr(v[1]), 1)
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[0]), addr(v[1]))
			m.emit(0x0f)
			m.emit(0x7e)
			m.mrsd(lcode(v[0]), addr(v[1]), 1)
		})
	}
	// MOVQ xmm, r64
	if isXMM(v0) && isReg64(v1) {
		self.require(ISA_SSE2)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x66)
			m.emit(0x48 | hcode(v[0])<<2 | hcode(v[1]))
			m.emit(0x0f)
			m.emit(0x7e)
			m.emit(0xc0 | lcode(v[0])<<3 | lcode(v[1]))
		})
	}
	// MOVQ r64, xmm
	if isReg64(v0) && isXMM(v1) {
		self.require(ISA_SSE2)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x66)
			m.emit(0x48 | hcode(v[1])<<2 | hcode(v[0]))
			m.emit(0x0f)
			m.emit(0x6e)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
	}
	// MOVQ xmm, xmm
	if isXMM(v0) && isXMM(v1) {
		self.require(ISA_SSE2)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xf3)
			m.rexo(hcode(v[1]), v[0], false)
			m.emit(0x0f)
			m.emit(0x7e)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x66)
			m.rexo(hcode(v[0]), v[1], false)
			m.emit(0x0f)
			m.emit(0xd6)
			m.emit(0xc0 | lcode(v[0])<<3 | lcode(v[1]))
		})
	}
	// MOVQ m64, xmm
	if isM64(v0) && isXMM(v1) {
		self.require(ISA_SSE2)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xf3)
			m.rexo(hcode(v[1]), addr(v[0]), false)
			m.emit(0x0f)
			m.emit(0x7e)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x66)
			m.rexm(1, hcode(v[1]), addr(v[0]))
			m.emit(0x0f)
			m.emit(0x6e)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
	}
	// MOVQ xmm, m64
	if isXMM(v0) && isM64(v1) {
		self.require(ISA_SSE2)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x66)
			m.rexo(hcode(v[0]), addr(v[1]), false)
			m.emit(0x0f)
			m.emit(0xd6)
			m.mrsd(lcode(v[0]), addr(v[1]), 1)
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x66)
			m.rexm(1, hcode(v[0]), addr(v[1]))
			m.emit(0x0f)
			m.emit(0x7e)
			m.mrsd(lcode(v[0]), addr(v[1]), 1)
		})
	}
	if p.len == 0 {
		panic("invalid operands for MOVQ")
	}
	return p
}

// MOVSD performs "Move Scalar Double-Precision Floating-Point Value".
//
// Mnemonic        : MOVSD
// Supported forms : (3 forms)
//
//   - MOVSD xmm, xmm    [SSE2]
//   - MOVSD m64, xmm    [SSE2]
//   - MOVSD xmm, m64    [SSE2]
func (self *Program) MOVSD(v0 interface{}, v1 interface{}) *Instruction {
	p := self.alloc("MOVSD", 2, Operands{v0, v1})
	// MOVSD xmm, xmm
	if isXMM(v0) && isXMM(v1) {
		self.require(ISA_SSE2)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xf2)
			m.rexo(hcode(v[1]), v[0], false)
			m.emit(0x0f)
			m.emit(0x10)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xf2)
			m.rexo(hcode(v[0]), v[1], false)
			m.emit(0x0f)
			m.emit(0x11)
			m.emit(0xc0 | lcode(v[0])<<3 | lcode(v[1]))
		})
	}
	// MOVSD m64, xmm
	if isM64(v0) && isXMM(v1) {
		self.require(ISA_SSE2)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xf2)
			m.rexo(hcode(v[1]), addr(v[0]), false)
			m.emit(0x0f)
			m.emit(0x10)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
	}
	// MOVSD xmm, m64
	if isXMM(v0) && isM64(v1) {
		self.require(ISA_SSE2)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xf2)
			m.rexo(hcode(v[0]), addr(v[1]), false)
			m.emit(0x0f)
			m.emit(0x11)
			m.mrsd(lcode(v[0]), addr(v[1]), 1)
		})
	}
	if p.len == 0 {
		panic("invalid operands for MOVSD")
	}
	return p
}

// MOVSLQ performs "Move Doubleword to Quadword with Sign-Extension".
//
// Mnemonic        : MOVSXD
// Supported forms : (2 forms)
//
//   - MOVSLQ r32, r64
//   - MOVSLQ m32, r64
func (self *Program) MOVSLQ(v0 interface{}, v1 interface{}) *Instruction {
	p := self.alloc("MOVSLQ", 2, Operands{v0, v1})
	// MOVSLQ r32, r64
	if isReg32(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1])<<2 | hcode(v[0]))
			m.emit(0x63)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
	}
	// MOVSLQ m32, r64
	if isM32(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[1]), addr(v[0]))
			m.emit(0x63)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
	}
	if p.len == 0 {
		panic("invalid operands for MOVSLQ")
	}
	return p
}

// MOVSS performs "Move Scalar Single-Precision Floating-Point Values".
//
// Mnemonic        : MOVSS
// Supported forms : (3 forms)
//
//   - MOVSS xmm, xmm    [SSE]
//   - MOVSS m32, xmm    [SSE]
//   - MOVSS xmm, m32    [SSE]
func (self *Program) MOVSS(v0 interface{}, v1 interface{}) *Instruction {
	p := self.alloc("MOVSS", 2, Operands{v0, v1})
	// MOVSS xmm, xmm
	if isXMM(v0) && isXMM(v1) {
		self.require(ISA_SSE)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xf3)
			m.rexo(hcode(v[1]), v[0], false)
			m.emit(0x0f)
			m.emit(0x10)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xf3)
			m.rexo(hcode(v[0]), v[1], false)
			m.emit(0x0f)
			m.emit(0x11)
			m.emit(0xc0 | lcode(v[0])<<3 | lcode(v[1]))
		})
	}
	// MOVSS m32, xmm
	if isM32(v0) && isXMM(v1) {
		self.require(ISA_SSE)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xf3)
			m.rexo(hcode(v[1]), addr(v[0]), false)
			m.emit(0x0f)
			m.emit(0x10)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
	}
	// MOVSS xmm, m32
	if isXMM(v0) && isM32(v1) {
		self.require(ISA_SSE)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xf3)
			m.rexo(hcode(v[0]), addr(v[1]), false)
			m.emit(0x0f)
			m.emit(0x11)
			m.mrsd(lcode(v[0]), addr(v[1]), 1)
		})
	}
	if p.len == 0 {
		panic("invalid operands for MOVSS")
	}
	return p
}

// RET performs "Return from Procedure".
//
// Mnemonic        : RET
// Supported forms : (2 forms)
//
//   - RET
//   - RET imm16
func (self *Program) RET(vv ...interface{}) *Instruction {
	var p *Instruction
	switch len(vv) {
	case 0:
		p = self.alloc("RET", 0, Operands{})
	case 1:
		p = self.alloc("RET", 1, Operands{vv[0]})
	default:
		panic("instruction RET takes 0 or 1 operands")
	}
	// RET
	if len(vv) == 0 {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xc3)
		})
	}
	// RET imm16
	if len(vv) == 1 && isImm16(vv[0]) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xc2)
			m.imm2(toImmAny(v[0]))
		})
	}
	if p.len == 0 {
		panic("invalid operands for RET")
	}
	return p
}

// SUBQ performs "Subtract".
//
// Mnemonic        : SUB
// Supported forms : (8 forms)
//
//   - SUBQ imm32, rax
//   - SUBQ imm8, r64
//   - SUBQ imm32, r64
//   - SUBQ r64, r64
//   - SUBQ m64, r64
//   - SUBQ imm8, m64
//   - SUBQ imm32, m64
//   - SUBQ r64, m64
func (self *Program) SUBQ(v0 interface{}, v1 interface{}) *Instruction {
	p := self.alloc("SUBQ", 2, Operands{v0, v1})
	// SUBQ imm32, rax
	if isImm32(v0) && v1 == RAX {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48)
			m.emit(0x2d)
			m.imm4(toImmAny(v[0]))
		})
	}
	// SUBQ imm8, r64
	if isImm8Ext(v0, 8) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1]))
			m.emit(0x83)
			m.emit(0xe8 | lcode(v[1]))
			m.imm1(toImmAny(v[0]))
		})
	}
	// SUBQ imm32, r64
	if isImm32Ext(v0, 8) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1]))
			m.emit(0x81)
			m.emit(0xe8 | lcode(v[1]))
			m.imm4(toImmAny(v[0]))
		})
	}
	// SUBQ r64, r64
	if isReg64(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[0])<<2 | hcode(v[1]))
			m.emit(0x29)
			m.emit(0xc0 | lcode(v[0])<<3 | lcode(v[1]))
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0x48 | hcode(v[1])<<2 | hcode(v[0]))
			m.emit(0x2b)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
	}
	// SUBQ m64, r64
	if isM64(v0) && isReg64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[1]), addr(v[0]))
			m.emit(0x2b)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
	}
	// SUBQ imm8, m64
	if isImm8Ext(v0, 8) && isM64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, 0, addr(v[1]))
			m.emit(0x83)
			m.mrsd(5, addr(v[1]), 1)
			m.imm1(toImmAny(v[0]))
		})
	}
	// SUBQ imm32, m64
	if isImm32Ext(v0, 8) && isM64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, 0, addr(v[1]))
			m.emit(0x81)
			m.mrsd(5, addr(v[1]), 1)
			m.imm4(toImmAny(v[0]))
		})
	}
	// SUBQ r64, m64
	if isReg64(v0) && isM64(v1) {
		p.domain = DomainGeneric
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexm(1, hcode(v[0]), addr(v[1]))
			m.emit(0x29)
			m.mrsd(lcode(v[0]), addr(v[1]), 1)
		})
	}
	if p.len == 0 {
		panic("invalid operands for SUBQ")
	}
	return p
}

// VPERMIL2PD performs "Permute Two-Source Double-Precision Floating-Point Vectors".
//
// Mnemonic        : VPERMIL2PD
// Supported forms : (6 forms)
//
//   - VPERMIL2PD imm4, xmm, xmm, xmm, xmm     [XOP]
//   - VPERMIL2PD imm4, m128, xmm, xmm, xmm    [XOP]
//   - VPERMIL2PD imm4, xmm, m128, xmm, xmm    [XOP]
//   - VPERMIL2PD imm4, ymm, ymm, ymm, ymm     [XOP]
//   - VPERMIL2PD imm4, m256, ymm, ymm, ymm    [XOP]
//   - VPERMIL2PD imm4, ymm, m256, ymm, ymm    [XOP]
func (self *Program) VPERMIL2PD(v0 interface{}, v1 interface{}, v2 interface{}, v3 interface{}, v4 interface{}) *Instruction {
	p := self.alloc("VPERMIL2PD", 5, Operands{v0, v1, v2, v3, v4})
	// VPERMIL2PD imm4, xmm, xmm, xmm, xmm
	if isImm4(v0) && isXMM(v1) && isXMM(v2) && isXMM(v3) && isXMM(v4) {
		self.require(ISA_XOP)
		p.domain = DomainAMDSpecific
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xc4)
			m.emit(0xe3 ^ (hcode(v[4]) << 7) ^ (hcode(v[2]) << 5))
			m.emit(0x79 ^ (hlcode(v[3]) << 3))
			m.emit(0x49)
			m.emit(0xc0 | lcode(v[4])<<3 | lcode(v[2]))
			m.emit((hlcode(v[1]) << 4) | imml(v[0]))
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xc4)
			m.emit(0xe3 ^ (hcode(v[4]) << 7) ^ (hcode(v[1]) << 5))
			m.emit(0xf9 ^ (hlcode(v[3]) << 3))
			m.emit(0x49)
			m.emit(0xc0 | lcode(v[4])<<3 | lcode(v[1]))
			m.emit((hlcode(v[2]) << 4) | imml(v[0]))
		})
	}
	// VPERMIL2PD imm4, m128, xmm, xmm, xmm
	if isImm4(v0) && isM128(v1) && isXMM(v2) && isXMM(v3) && isXMM(v4) {
		self.require(ISA_XOP)
		p.domain = DomainAMDSpecific
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.vex3(0xc4, 0b11, 0x81, hcode(v[4]), addr(v[1]), hlcode(v[3]))
			m.emit(0x49)
			m.mrsd(lcode(v[4]), addr(v[1]), 1)
			m.emit((hlcode(v[2]) << 4) | imml(v[0]))
		})
	}
	// VPERMIL2PD imm4, xmm, m128, xmm, xmm
	if isImm4(v0) && isXMM(v1) && isM128(v2) && isXMM(v3) && isXMM(v4) {
		self.require(ISA_XOP)
		p.domain = DomainAMDSpecific
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.vex3(0xc4, 0b11, 0x01, hcode(v[4]), addr(v[2]), hlcode(v[3]))
			m.emit(0x49)
			m.mrsd(lcode(v[4]), addr(v[2]), 1)
			m.emit((hlcode(v[1]) << 4) | imml(v[0]))
		})
	}
	// VPERMIL2PD imm4, ymm, ymm, ymm, ymm
	if isImm4(v0) && isYMM(v1) && isYMM(v2) && isYMM(v3) && isYMM(v4) {
		self.require(ISA_XOP)
		p.domain = DomainAMDSpecific
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xc4)
			m.emit(0xe3 ^ (hcode(v[4]) << 7) ^ (hcode(v[2]) << 5))
			m.emit(0x7d ^ (hlcode(v[3]) << 3))
			m.emit(0x49)
			m.emit(0xc0 | lcode(v[4])<<3 | lcode(v[2]))
			m.emit((hlcode(v[1]) << 4) | imml(v[0]))
		})
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.emit(0xc4)
			m.emit(0xe3 ^ (hcode(v[4]) << 7) ^ (hcode(v[1]) << 5))
			m.emit(0xfd ^ (hlcode(v[3]) << 3))
			m.emit(0x49)
			m.emit(0xc0 | lcode(v[4])<<3 | lcode(v[1]))
			m.emit((hlcode(v[2]) << 4) | imml(v[0]))
		})
	}
	// VPERMIL2PD imm4, m256, ymm, ymm, ymm
	if isImm4(v0) && isM256(v1) && isYMM(v2) && isYMM(v3) && isYMM(v4) {
		self.require(ISA_XOP)
		p.domain = DomainAMDSpecific
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.vex3(0xc4, 0b11, 0x85, hcode(v[4]), addr(v[1]), hlcode(v[3]))
			m.emit(0x49)
			m.mrsd(lcode(v[4]), addr(v[1]), 1)
			m.emit((hlcode(v[2]) << 4) | imml(v[0]))
		})
	}
	// VPERMIL2PD imm4, ymm, m256, ymm, ymm
	if isImm4(v0) && isYMM(v1) && isM256(v2) && isYMM(v3) && isYMM(v4) {
		self.require(ISA_XOP)
		p.domain = DomainAMDSpecific
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.vex3(0xc4, 0b11, 0x05, hcode(v[4]), addr(v[2]), hlcode(v[3]))
			m.emit(0x49)
			m.mrsd(lcode(v[4]), addr(v[2]), 1)
			m.emit((hlcode(v[1]) << 4) | imml(v[0]))
		})
	}
	if p.len == 0 {
		panic("invalid operands for VPERMIL2PD")
	}
	return p
}

// XORPS performs "Bitwise Logical XOR for Single-Precision Floating-Point Values".
//
// Mnemonic        : XORPS
// Supported forms : (2 forms)
//
//   - XORPS xmm, xmm     [SSE]
//   - XORPS m128, xmm    [SSE]
func (self *Program) XORPS(v0 interface{}, v1 interface{}) *Instruction {
	p := self.alloc("XORPS", 2, Operands{v0, v1})
	// XORPS xmm, xmm
	if isXMM(v0) && isXMM(v1) {
		self.require(ISA_SSE)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexo(hcode(v[1]), v[0], false)
			m.emit(0x0f)
			m.emit(0x57)
			m.emit(0xc0 | lcode(v[1])<<3 | lcode(v[0]))
		})
	}
	// XORPS m128, xmm
	if isM128(v0) && isXMM(v1) {
		self.require(ISA_SSE)
		p.domain = DomainMMXSSE
		p.add(0, func(m *_Encoding, v []interface{}) {
			m.rexo(hcode(v[1]), addr(v[0]), false)
			m.emit(0x0f)
			m.emit(0x57)
			m.mrsd(lcode(v[1]), addr(v[0]), 1)
		})
	}
	if p.len == 0 {
		panic("invalid operands for XORPS")
	}
	return p
}
