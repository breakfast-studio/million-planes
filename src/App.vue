<template>
    <Lunchbox
        :cameraPosition="[-20, 8, -10]"
        :cameraLook="[0, 2, 20]"
        transparent
        background="transparent"
    >
        <mesh>
            <bufferGeometry @added="geoAdded" />
            <shaderMaterial
                :side="THREE.DoubleSide"
                ref="shaderMaterial"
                :args="[
                    {
                        vertexShader: shaders.vert,
                        fragmentShader: shaders.frag,
                        uniforms: {
                            time: {
                                value: 1.0,
                            },
                        },
                    },
                ]"
            />
        </mesh>
    </Lunchbox>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import * as shaders from './shaders'
import { Lunch, onBeforeRender } from 'lunchboxjs'
import { ref } from 'vue'

const pointCount = 1000000

// Build geometries
const original = new THREE.PlaneGeometry().toNonIndexed()
const geoAdded = ({ instance: geo }: { instance: THREE.BufferGeometry }) => {
    const verts = new Float32Array(
        new Array(pointCount)
            .fill(undefined)
            .flatMap(() => Array.from(original.attributes.position.array))
    )
    // set positions
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3))

    // set indexes
    const indexes = new Float32Array(
        verts.map((v, i) => {
            // 6 vertices per plane
            return Math.floor(i / original.attributes.position.array.length)
        })
    )
    geo.setAttribute('idx', new THREE.BufferAttribute(indexes, 1))
}

// Save shader material
const shaderMaterial = ref<Lunch.Node<THREE.ShaderMaterial>>()

// Time
const time = ref(Date.now())

// Update time uniform
onBeforeRender(() => {
    if (shaderMaterial.value?.instance) {
        shaderMaterial.value.instance.uniforms.time.value += 1.0
    }
    time.value = Date.now()
})
</script>