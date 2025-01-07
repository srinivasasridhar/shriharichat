import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import HomeHeader from '@/components/HomeHeader'

const InsideLayout = () => {
    return (

        <Stack>
            <Stack.Screen
                name="home"
                options={
                    {
                        header: () => <HomeHeader headerText="Chats" />
                    }
                }
            />
            <Stack.Screen
                name="profile"
                options={
                    {
                        header: () => <HomeHeader headerText="Profile" showBackButton="true" />
                    }
                }
            />
        </Stack>

    )
}

export default InsideLayout

const styles = StyleSheet.create({})